import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import middy from "@middy/core";
import wsJsonBodyParser from "@middy/ws-json-body-parser";
import { FromSchema } from "json-schema-to-ts";
import { BaseDynamoDBClass } from "../../../lib/ddb/base.repository.js";
import { ChatRepository } from "../../../lib/ddb/chat/chat.repository.js";
import { ChatRoomRepository } from "../../../lib/ddb/chat/chatroom.repository.js";
import { globalErrorHandler } from "../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../lib/middlewares/io-logger.js";
import { randomId } from "../../../lib/util/index.js";

const bodySchema = {
  type: "object",
  properties: {
    message_type: { type: "string" },
    room_id: { type: "string" },
    room_name: { type: "string" },
    message: { type: "string" },
    members: { type: "array", items: { type: "string" } },
  },
  if: {
    properties: {
      message_type: { const: "$sendchat" },
    },
  },
  // 최소한개 이상의 members
  then: {
    properties: {
      members: {
        minItems: 2,
      },
    },
    required: ["message_type", "message", "members"],
  },
  required: ["message_type", "message"],
  additionalProperties: false,
} as const;

const eventSchema = {
  type: "object",
  properties: {
    body: bodySchema,
    requestContext: {
      type: "object",
      properties: {
        connectionId: { type: "string" },
      },
    },
  },
  required: ["body", "requestContext"],
} as const;

const TABLE_NAME =
  (process.env.CONNECTIONS_TABLE as string) || "websocketTable";
const dynamoDb = new BaseDynamoDBClass(TABLE_NAME);
const chatRepository = new ChatRepository();
const chatRoomRepository = new ChatRoomRepository();

export const broadcastHandler = async (
  event: FromSchema<typeof eventSchema>
) => {
  const body = event.body;

  const scanParams = {
    ProjectionExpression: "connectionId",
  };

  const connectionData = await dynamoDb.scanItems<{
    connectionId: string;
  }>(scanParams);

  const apiGatewayManagementApi = new ApiGatewayManagementApiClient({
    endpoint:
      "https://" +
      event.requestContext.domainName +
      "/" +
      event.requestContext.stage,
  });

  const postCalls = connectionData.map(async ({ connectionId }) => {
    try {
      const command = new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: Buffer.from(JSON.stringify(body), "utf-8"),
      });
      await apiGatewayManagementApi.send(command);
    } catch (e: any) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await dynamoDb.deleteItem({ connectionId });
      } else {
        throw e;
      }
    }
  });

  await Promise.all(postCalls || []);

  return {
    statusCode: 200,
    body: "Message sent",
  };
};

// Send message to chatroom
export const sendchatHandler = async (
  event: FromSchema<typeof eventSchema>
) => {
  const connectionId = event.requestContext.connectionId;
  const body = event.body;

  const { user_email } = await dynamoDb.getItem<{ user_email: string }>({
    connectionId,
  });

  const { room_id = randomId(), message, members } = body;

  await chatRepository.createChat({
    room_id,
    user_email: user_email,
    message,
  });
  // if first message, then create chatroom
  if (!body.room_id) {
    await chatRoomRepository.createChatRoom(
      { room_id, user_email: user_email },
      {
        last_message: message,
        badge_count: 0,
        room_name: user_email,
        members,
      }
    );

    members?.forEach(async (member) => {
      await chatRoomRepository.createChatRoom(
        { room_id, user_email: member },
        {
          last_message: message,
          badge_count: 1,
          room_name: user_email,
          members,
        }
      );
    });
  } else {
    // else update chatroom
    await chatRoomRepository.updateChatRoom(
      { room_id, user_email: user_email },
      {
        last_message: message,
        badge_count: 0,
      }
    );

    members?.forEach(async (member) => {
      await chatRoomRepository.updateChatRoom(
        { room_id, user_email: member },
        {
          last_message: message,
          badge_count_increment: 1,
        }
      );
    });
  }

  return {
    statusCode: 200,
    body: "Message sent",
  };
};

const lambdaHandler = async (event: FromSchema<typeof eventSchema>) => {
  const { message_type } = event.body;

  switch (message_type) {
    case "$sendchat":
      return sendchatHandler(event);
    case "$broadcast":
      return broadcastHandler(event);
    default:
      return {
        statusCode: 400,
        body: "Invalid route",
      };
  }
};

export const handler = middy()
  .use(globalErrorHandler())
  .use(ioLogger())
  .use(wsJsonBodyParser())
  .handler(lambdaHandler);
