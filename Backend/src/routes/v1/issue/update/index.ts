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
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    issue_status: { type: "string" },
    due_date: { type: "string" },
  },
  required: [],
  additionalProperties: false,
  minProperties: 1,
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
  path        : "/v1/issues/{issueId}",
  method      : "put",
  tags        : ["Issue"],
  summary     : "Issue.update",
  description : "Update a issue",
  operationId : "updateIssue",
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
  const { title, description } = event.body;
  const user_email = event.requestContext.authorizer.lambda.email;

  await issueRepository.updateIssue(
    { user_email, issue_id: issueId },
    {
      title,
      description,
    }
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
