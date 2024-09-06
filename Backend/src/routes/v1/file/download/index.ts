import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { FromSchema } from "json-schema-to-ts";
import { getDownloadPresignedUrl } from "../../../../lib/aws/s3.service.js";
import { FileRepository } from "../../../../lib/ddb/file.repository.js";
import { globalErrorHandler } from "../../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../../lib/middlewares/io-logger.js";
import { userFriendlyValidator } from "../../../../lib/middlewares/user-friendly.validator.js";
import { requestContextSchema } from "../../../../lib/util/index.js";

const bodySchema = {
  type: "object",
  properties: {
    fileId: { type: "string" },
    name: { type: "string" },
  },
  required: ["fileId"],
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
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/files/download",
  method      : "post",
  tags        : ["File"],
  summary     : "File.download",
  description : "Create a presigned url for download",
  operationId : "downloadFile",
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

const fileRepository = new FileRepository();
export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;
  const { fileId, name } = event.body;

  const file = await fileRepository.getFile(user_email, fileId);

  const url = await getDownloadPresignedUrl({
    bucket: file.bucket,
    key: file.key,
    downloadFileName: name || file.name,
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
  .use(httpJsonBodyParser())
  .use(userFriendlyValidator({ eventSchema }))
  .handler(lambdaHandler);
