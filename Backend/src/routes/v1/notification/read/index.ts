import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { FromSchema } from "json-schema-to-ts";
import { NotificationRepository } from "../../../../lib/ddb/notification.repository.js";
import { globalErrorHandler } from "../../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../../lib/middlewares/io-logger.js";
import { userFriendlyValidator } from "../../../../lib/middlewares/user-friendly.validator.js";
import {
  pathSchemaToParameters,
  requestContextSchema,
} from "../../../../lib/util/index.js";

const bodySchema = {
  type: "object",
  properties: {},
  required: [],
  additionalProperties: false,
} as const;

const pathSchema = {
  type: "object",
  properties: {
    notificationId: { type: "string" },
  },
  required: ["notificationId"],
  additionalProperties: false,
} as const;

const eventSchema = {
  type: "object",
  properties: {
    body: bodySchema,
    pathParameters: pathSchema,
    requestContext: requestContextSchema,
  },
  required: ["body", "pathParameters", "requestContext"],
} as const;

const responseSchema = {
  type: "object",
  properties: {
    message: { type: "string", example: "success" },
  },
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/notifications/{notificationId}/read",
  method      : "post",
  tags        : ["Notification"],
  summary     : "Notification.read",
  description : "Read a notification",
  operationId : "readNotification",
  parameters  : pathSchemaToParameters(pathSchema),
  requestBody : {
    required: true,
    content: { "application/json": { schema: bodySchema } },
  },
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
  const notificationId = event.pathParameters.notificationId;

  await notificationRepository.readNotificationItem(user_email, notificationId);

  return {
    statusCode: 200,
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
