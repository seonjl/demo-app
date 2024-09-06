import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { FromSchema } from "json-schema-to-ts";
import {
  createMediaLiveChannel,
  createMediaLiveInput,
  createMediaPackageChannel,
  createMediaPackageOriginEndpoint,
} from "../../../../lib/aws/media.service.js";
import { MediaRepository } from "../../../../lib/ddb/media.repository.js";
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

const eventSchema = {
  type: "object",
  properties: {
    body: bodySchema,
    requestContext: requestContextSchema,
  },
  required: ["body", "requestContext"],
} as const;

const responseSchema = {
  type: "object",
  properties: {
    message: { type: "string", example: "success" },
  },
};

// prettier-ignore
export const apiSchema = {
  path        : "/v1/channels",
  method      : "post",
  tags        : ["Channel"],
  summary     : "Channel.create",
  description : "Create a channel",
  operationId : "createChannel",
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
export async function lambdaHandler(event: FromSchema<typeof eventSchema>) {
  const user_email = event.requestContext.authorizer.lambda.email;
  const user_id = user_email.replace("@", "__").replaceAll(".", "-");

  // 1. MediaLive Input 생성
  const inputName = user_id + "-input";
  const createMediaLiveInputResponse = await createMediaLiveInput({
    inputName,
  });

  // 2. MediaPackage 채널 생성
  const channelName = user_id + "-channel";
  const createMediaPackageChannelResponse = await createMediaPackageChannel({
    channelName,
  });

  // 3. MediaPackage origin 엔드포인트 생성
  const createMediaPackageOriginEndpointResponse =
    await createMediaPackageOriginEndpoint({
      channelName,
      mediaPackageChannelId: createMediaPackageChannelResponse.Id,
    });

  // 4. MediaLive 채널 생성
  const createMediaLiveChannelResponse = await createMediaLiveChannel({
    channelName,
    inputId: createMediaLiveInputResponse.Id,
    mediaPackageChannelId: createMediaPackageChannelResponse.Id,
  });

  const mediaRepository = new MediaRepository();

  await mediaRepository.putItem({
    user_email,
    input_id: createMediaLiveInputResponse.Id,
    channel_name: channelName,
    media_package_channel_id: createMediaPackageChannelResponse.Id,
    media_live_channel_id: createMediaLiveChannelResponse.Id,
    media_package_origin_endpoint_id:
      createMediaPackageOriginEndpointResponse.Id,
    stream_key: createMediaLiveInputResponse.streamKey,
    server_url: createMediaLiveInputResponse.serverUrl,
  });

  return {
    statusCode: 201,
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
