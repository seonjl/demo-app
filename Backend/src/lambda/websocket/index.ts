import middy from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { BaseDynamoDBClass } from "../../lib/ddb/base.repository.js";
import { getUserInfoByGoogle } from "../../lib/google/oauth.service.js";
import { globalErrorHandler } from "../../lib/middlewares/global-error-handler.js";

const TABLE_NAME =
  (process.env.CONNECTIONS_TABLE as string) || "websocketTable";
const dynamoDb = new BaseDynamoDBClass(TABLE_NAME);

const connectHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResultV2> => {
  const connectionId = event.requestContext.connectionId;
  const token = event.queryStringParameters?.token || "";

  const { email } = await getUserInfoByGoogle(token);

  await dynamoDb.putItem({
    connectionId: connectionId,
    user_email: email,
    timestamp: Date.now(),
  });

  return {
    statusCode: 200,
    body: "Connected",
  };
};

const disconnectHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResultV2> => {
  const connectionId = event.requestContext.connectionId;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      connectionId: connectionId,
    },
  };

  await dynamoDb.deleteItem({ connectionId });

  return {
    statusCode: 200,
    body: "Disconnected",
  };
};

const lambdaHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResultV2> => {
  const routeKey = event.requestContext.routeKey;

  switch (routeKey) {
    case "$connect":
      return connectHandler(event);
    case "$disconnect":
      return disconnectHandler(event);
    default:
      return {
        statusCode: 400,
        body: "Invalid route",
      };
  }
};

export const handler = middy(lambdaHandler).use(globalErrorHandler());
