import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { FromSchema } from "json-schema-to-ts";
import { globalErrorHandler } from "../../../../lib/middlewares/global-error-handler.js";
import { ioLogger } from "../../../../lib/middlewares/io-logger.js";
import { userFriendlyValidator } from "../../../../lib/middlewares/user-friendly.validator.js";
import { requestContextSchema } from "../../../../lib/util/index.js";

const bodySchema = {
  type: "object",
  properties: {},
  required: [],
  additionalProperties: false,
} as const;

const pathSchema = {
  type: "object",
  properties: {
    channel_id: { type: "string" },
  },
  required: ["channel_id"],
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
  path        : "/v1/channels/{channel_id}/start",
  method      : "post",
  tags        : ["Channel"],
  summary     : "Channel.start",
  description : "Start a Channel",
  operationId : "startChannel",
  requestBody : {
    required: true,
    content: { "application/json": { schema: bodySchema } },
  },
  responses: {
    201: {
      description: "",
      content: { "application/json": { schema: responseSchema } },
    },
  },
};

import { startMediaLiveChannel } from "../../../../lib/aws/media.service.js";
import { MediaRepository } from "../../../../lib/ddb/media.repository.js";

export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;
  const channel_id = event.pathParameters!.channel_id;

  const mediaRepository = new MediaRepository();
  const mediaItem = await mediaRepository.getMediaItem(user_email);

  // 4. MediaLive 채널 시작
  await startMediaLiveChannel({
    ChannelId: channel_id,
  });

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
