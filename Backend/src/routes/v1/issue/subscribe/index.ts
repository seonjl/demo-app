import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { FromSchema } from "json-schema-to-ts";
import { IssueRepository } from "../../../../lib/ddb/issue.repository.js";
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
    issueId: { type: "string" },
  },
  required: ["issueId"],
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
  path        : "/v1/issues/{issueId}/subscribe",
  method      : "post",
  tags        : ["Issue"],
  summary     : "Issue.subscribe",
  description : "Subscribe a issue",
  operationId : "subscribeIssue",
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

const issueRepository = new IssueRepository();
export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const issueId = event.pathParameters.issueId;
  const user_email = event.requestContext.authorizer.lambda.email;

  await issueRepository.subscribeIssue(
    { issue_id: issueId },
    { subscriber: user_email }
  );

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
