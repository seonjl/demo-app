import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { FromSchema } from "json-schema-to-ts";
import { ChatRepository } from "../../../../../lib/ddb/chat/chat.repository.js";
import { ChatRoomRepository } from "../../../../../lib/ddb/chat/chatroom.repository.js";
import { globalErrorHandler } from "../../../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../../../lib/middlewares/io-logger.js";
import { userFriendlyValidator } from "../../../../../lib/middlewares/user-friendly.validator.js";
import {
  pathSchemaToParameters,
  requestContextSchema,
} from "../../../../../lib/util/index.js";

const bodySchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    members: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      description: "members email, only when create chatroom(first message)",
    },
  },
  required: ["message"],
  additionalProperties: false,
} as const;

const pathSchema = {
  type: "object",
  properties: {
    room_id: { type: "string" },
  },
  required: ["room_id"],
  additionalProperties: false,
} as const;

const eventSchema = {
  type: "object",
  properties: {
    pathParameters: pathSchema,
    body: bodySchema,
    requestContext: requestContextSchema,
  },
  required: ["pathParameters", "body", "requestContext"],
} as const;

const responseSchema = {
  type: "object",
  properties: {
    message: { type: "string", example: "success" },
  },
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/chatrooms/{room_id}/chats",
  method      : "post",
  tags        : ["Chat"],
  summary     : "Chat.create",
  description : "Create a chats",
  operationId : "createChat",
  parameters  : pathSchemaToParameters(pathSchema),
  requestBody : {
    required: true,
    content: { "application/json": { schema: bodySchema } },
  },
  responses   : {
    200: {
      description: "",
      content: { "application/json": { schema: responseSchema } },
    },
  },
};

const chatRepository = new ChatRepository();
const chatRoomRepository = new ChatRoomRepository();

export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;
  const room_id = event.pathParameters.room_id;
  const { message, members } = event.body;

  await chatRepository.createChat({
    room_id,
    user_email: user_email,
    message,
  });

  // if first message, then create chatroom
  if (members) {
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
    const chatroom = await chatRoomRepository.getChatRoom(room_id, user_email);

    await chatRoomRepository.updateChatRoom(
      { room_id, user_email: user_email },
      {
        last_message: message,
        badge_count: 0,
      }
    );

    chatroom.members?.forEach(async (member) => {
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
    statusCode: 201,
    body: JSON.stringify({
      message: "success",
    }),
  };
}

export const handler = middy()
  .use(globalErrorHandler())
  .use(ioLogger())
  .use(httpJsonBodyParser())
  .use(userFriendlyValidator({ eventSchema }))
  .handler(lambdaHandler);
