import middy from "@middy/core";
import { FromSchema } from "json-schema-to-ts";
import { ChatRepository } from "../../../../../lib/ddb/chat/chat.repository.js";
import { ChatRoomRepository } from "../../../../../lib/ddb/chat/chatroom.repository.js";
import { globalErrorHandler } from "../../../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../../../lib/middlewares/io-logger.js";
import { userFriendlyValidator } from "../../../../../lib/middlewares/user-friendly.validator.js";
import {
  pathSchemaToParameters,
  querySchemaToParameters,
  requestContextSchema,
} from "../../../../../lib/util/index.js";

const querySchema = {
  type: "object",
  properties: {
    limit: { type: "string" },
    created_at: { type: "string" },
  },
  required: [],
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
    queryStringParameters: querySchema,
    requestContext: requestContextSchema,
  },
  required: ["pathParameters", "requestContext"],
} as const;

const responseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      room_id: { type: "string" },
      user_email: { type: "string" },
      message: { type: "string" },
      created_at: { type: "string" },
      updated_at: { type: "string" },
    },
    required: ["room_id", "user_email", "message", "created_at", "updated_at"],
  },
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/chatrooms/{room_id}/chats",
  method      : "get",
  tags        : ["Chat"],
  summary     : "Chat.list",
  description : "List chats",
  operationId : "listChats",
  parameters  : [...pathSchemaToParameters(pathSchema), ...querySchemaToParameters(querySchema)],
  responses   : {
    200: {
      description: "",
      content: { "application/json": { schema: responseSchema } },
    },
  },
};

const chatRepository = new ChatRepository();
const chatroomRepository = new ChatRoomRepository();

export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;
  const room_id = event.pathParameters.room_id;
  const created_at = event.queryStringParameters?.created_at;
  const limit = Number(event.queryStringParameters?.limit) || 24;
  const chats = await chatRepository.listChats(room_id, {
    ExclusiveStartKey: created_at
      ? {
          room_id: room_id,
          created_at: created_at,
        }
      : undefined,
    Limit: limit,
  });

  await chatroomRepository.updateChatRoomBadgeCountIntoZero({
    room_id,
    user_email,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(chats),
  };
}

export const handler = middy()
  .use(globalErrorHandler())
  .use(ioLogger())
  .use(userFriendlyValidator({ eventSchema }))
  .handler(lambdaHandler);
