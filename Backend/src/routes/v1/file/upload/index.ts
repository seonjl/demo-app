import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { FromSchema } from "json-schema-to-ts";
import { getSinglePartPresignedUrl } from "../../../../lib/aws/s3.service.js";
import { globalErrorHandler } from "../../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../../lib/middlewares/io-logger.js";
import { userFriendlyValidator } from "../../../../lib/middlewares/user-friendly.validator.js";
import { requestContextSchema } from "../../../../lib/util/index.js";

const bodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    metadata: { type: "object", additionalProperties: { type: "string" } }, // key-value pair only string
  },
  required: ["name"],
  additionalProperties: false,
} as const;

const eventSchema = {
  type: "object",
  properties: {
    requestContext: requestContextSchema,
    body: bodySchema,
  },
  required: ["requestContext", "body"],
} as const;

const responseSchema = {
  type: "object",
  properties: {
    url: { type: "string" },
  },
  required: ["url"],
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/files/upload",
  method      : "post",
  tags        : ["File"],
  summary     : "File.upload",
  description : "upload a file",
  operationId : "uploadFile",
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

export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;
  const { name, metadata } = event.body;

  const url = await getSinglePartPresignedUrl({
    bucket: process.env.FILE_INVENTORY_BUCKET_NAME!,
    key: user_email + "/" + name,
    metadata: {
      ...metadata,
      name,
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: url,
    }),
  };
}

export const handler = middy()
  .use(globalErrorHandler())
  .use(ioLogger())
  .use(jsonBodyParser())
  .use(userFriendlyValidator({ eventSchema }))
  .handler(lambdaHandler);
