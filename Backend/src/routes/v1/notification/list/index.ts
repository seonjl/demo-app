import middy from "@middy/core";
import { FromSchema } from "json-schema-to-ts";
import { NotificationRepository } from "../../../../lib/ddb/notification.repository.js";
import { globalErrorHandler } from "../../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../../lib/middlewares/io-logger.js";
import { userFriendlyValidator } from "../../../../lib/middlewares/user-friendly.validator.js";
import { requestContextSchema } from "../../../../lib/util/index.js";

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

// prettier-ignore
const responseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      user_email  : { type: "string" },
      created_at  : { type: "string" },
      id          : { type: "string" },
      is_read     : { type: "boolean" },
      title       : { type: "string" },
      description : { type: "string" },
    },
    required: [
      "user_email",
      "created_at",
      "id",
      "is_read",
      "title",
      "description",
    ],
  },
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/notifications",
  method      : "get",
  tags        : ["Notification"],
  summary     : "Notification.list",
  description : "list a notification",
  operationId : "listNotifications",
  responses: {
    200: {
      description: "",
      content: { "application/json": { schema: responseSchema } },
    },
  },
};

const notificationRepository = new NotificationRepository();
export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;
  const notifications = await notificationRepository.listNotificationItems({
    user_email,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(notifications),
  };
}

export const handler = middy()
  .use(globalErrorHandler())
  .use(ioLogger())
  .use(userFriendlyValidator({ eventSchema }))
  .handler(lambdaHandler);
