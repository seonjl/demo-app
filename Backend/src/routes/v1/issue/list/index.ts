import middy from "@middy/core";
import { FromSchema } from "json-schema-to-ts";
import { IssueRepository } from "../../../../lib/ddb/issue.repository.js";
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
    all: {
      type: "boolean",
      description: "모든 이슈 조회",
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
      created_at: { type: "string" },
      id: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      subscribers: { type: "array", items: { type: "string" } },
    },
    required: ["user_email", "created_at", "id", "title", "description"],
  },
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/issues",
  method      : "get",
  tags        : ["Issue"],
  summary     : "Issue.list",
  description : "List issues",
  operationId : "listIssues",
  parameters  : querySchemaToParameters(querySchema),
  responses   : {
    200: {
      description: "",
      content: { "application/json": { schema: responseSchema } },
    },
  },
};

const issueRepository = new IssueRepository();

export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;
  const all = event.queryStringParameters?.all;

  if (all === true) {
    const issues = await issueRepository.listAllIssues();
    return {
      statusCode: 200,
      body: JSON.stringify(issues),
    };
  }

  const issues = await issueRepository.listMyIssues({
    user_email,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(issues),
  };
}

export const handler = middy()
  .use(globalErrorHandler())
  .use(ioLogger())
  .use(userFriendlyValidator({ eventSchema }))
  .handler(lambdaHandler);
