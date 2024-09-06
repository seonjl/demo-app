import middy from "@middy/core";
import { FromSchema } from "json-schema-to-ts";
import { FileRepository } from "../../../../lib/ddb/file.repository.js";
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
      id          : { type: "string" },
      created_at  : { type: "string" },
      name        : { type: "string" },
      size        : { type: "string" },
      bucket      : { type: "string" },
      key         : { type: "string" },
      uploaded_at : { type: "string" },
    },
    required: [
      "user_email",
      "id",
      "created_at",
      "name",
      "size",
      "bucket",
      "key",
      "uploaded_at",
    ],
  },
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/files",
  method      : "get",
  tags        : ["File"],
  summary     : "File.list",
  description : "list a file",
  operationId : "listFiles",
  responses: {
    200: {
      description: "",
      content: { "application/json": { schema: responseSchema } },
    },
  },
};

const fileRepository = new FileRepository();
export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;
  const files = await fileRepository.listFiles({
    user_email,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(files),
  };
}

export const handler = middy()
  .use(globalErrorHandler())
  .use(ioLogger())
  .use(userFriendlyValidator({ eventSchema }))
  .handler(lambdaHandler);
