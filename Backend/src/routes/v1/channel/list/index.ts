import middy from "@middy/core";
import { FromSchema } from "json-schema-to-ts";
import { MediaRepository } from "../../../../lib/ddb/media.repository.js";
import { globalErrorHandler } from "../../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../../lib/middlewares/io-logger.js";
import { userFriendlyValidator } from "../../../../lib/middlewares/user-friendly.validator.js";
import {
  querySchemaToParameters,
  requestContextSchema,
} from "../../../../lib/util/index.js";

const querySchema = {
  type: "object",
  properties: {
    "created_at>": {
      type: "string",
      description: "생성일시",
      example: "2024-06-01T00:00:00Z",
    },
    "created_at<": {
      type: "string",
      description: "생성일시",
      example: "2024-07-01T00:00:00Z",
    },
  },
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
      user_email: { type: "string" },
      task_id: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      task_status: { type: "string" },
      due_date: { type: "string" },
      created_at: { type: "string" },
    },
    required: [
      "user_email",
      "task_id",
      "title",
      "description",
      "task_status",
      "due_date",
      "created_at",
    ],
  },
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/tasks",
  method      : "get",
  tags        : ["Task"],
  summary     : "Task.list",
  description : "List tasks",
  operationId : "listTasks",
  parameters  : querySchemaToParameters(querySchema),
  responses   : {
    200: {
      description: "",
      content: { "application/json": { schema: responseSchema } },
    },
  },
};

const mediaRepository = new MediaRepository();

export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;

  const channels = await mediaRepository.listMediaItems();

  return {
    statusCode: 200,
    body: JSON.stringify(channels),
  };
}

export const handler = middy()
  .use(globalErrorHandler())
  .use(ioLogger())
  .use(userFriendlyValidator({ eventSchema }))
  .handler(lambdaHandler);
