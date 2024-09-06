import middy from "@middy/core";
import { FromSchema } from "json-schema-to-ts";
import { ChatRoomRepository } from "../../../../lib/ddb/chat/chatroom.repository.js";
import { globalErrorHandler } from "../../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../../lib/middlewares/io-logger.js";
import { userFriendlyValidator } from "../../../../lib/middlewares/user-friendly.validator.js";
import {
  querySchemaToParameters,
  requestContextSchema,
} from "../../../../lib/util/index.js";

const querySchema = {
  type: "object",
  properties: {},
  required: [],
  additionalProperties: false,
} as const;

const eventSchema = {
  type: "object",
  properties: {
    queryStringParameters: querySchema,
    requestContext: requestContextSchema,
  },
  required: ["requestContext"],
} as const;

const responseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      room_id: { type: "string" },
      user_email: { type: "string" },
      last_chatted_at: { type: "string" },
      last_message: { type: "string" },
      badge_count: { type: "number" },
      room_name: { type: "array", items: { type: "string" } },
      created_at: { type: "string" },
      updated_at: { type: "string" },
    },
    required: [
      "room_id",
      "user_email",
      "last_chatted_at",
      "last_message",
      "badge_count",
    ],
  },
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/chatrooms",
  method      : "get",
  tags        : ["Chat"],
  summary     : "Chatroom.list",
  description : "List chatrooms",
  operationId : "listChatrooms",
  parameters  : querySchemaToParameters(querySchema),
  responses   : {
    200: {
      description: "",
      content: { "application/json": { schema: responseSchema } },
    },
  },
};

const chatroomRepository = new ChatRoomRepository();

export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;
  const chatrooms = await chatroomRepository.listChatRooms(user_email);

  return {
    statusCode: 200,
    body: JSON.stringify(chatrooms),
  };
}

export const handler = middy()
  .use(globalErrorHandler())
  .use(ioLogger())
  .use(userFriendlyValidator({ eventSchema }))
  .handler(lambdaHandler);
