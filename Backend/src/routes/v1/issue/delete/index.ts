import middy from "@middy/core";
import { FromSchema } from "json-schema-to-ts";
import { IssueRepository } from "../../../../lib/ddb/issue.repository.js";
import { globalErrorHandler } from "../../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../../lib/middlewares/io-logger.js";
import { userFriendlyValidator } from "../../../../lib/middlewares/user-friendly.validator.js";
import {
  pathSchemaToParameters,
  requestContextSchema,
} from "../../../../lib/util/index.js";

const pathSchema = {
  type: "object",
  properties: {
    issueId: { type: "string" },
  },
  required: ["issueId"],
} as const;

const eventSchema = {
  type: "object",
  properties: {
    pathParameters: pathSchema,
    requestContext: requestContextSchema,
  },
  required: ["pathParameters", "requestContext"],
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
  method      : "delete",
  tags        : ["Issue"],
  summary     : "Issue.delete",
  description : "Delete a issue",
  operationId : "deleteIssue",
  parameters  : pathSchemaToParameters(pathSchema),
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

  await issueRepository.deleteIssue(user_email, issueId);

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
  .use(userFriendlyValidator({ eventSchema }))
  .handler(lambdaHandler);
