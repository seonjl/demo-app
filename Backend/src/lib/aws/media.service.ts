import {
  CreateChannelCommand,
  CreateInputCommand,
  MediaLiveClient,
  StartChannelCommand,
} from "@aws-sdk/client-medialive";
import {
  CreateChannelCommand as CreateMediaPackageChannelCommand,
  CreateOriginEndpointCommand,
  MediaPackageClient,
} from "@aws-sdk/client-mediapackage";
import { randomId } from "../util";

// 1. MediaLive Input 생성
export const createMediaLiveInput = async ({
  inputName,
}: {
  inputName: string;
}) => {
  const streamKey = randomId();

  if (process.env.MEDIA_LIVE_INPUT_SECURITY_GROUP_ID === undefined) {
    throw new Error("MEDIA_LIVE_INPUT_SECURITY_GROUP_ID is not set");
  }

  const medialiveClient = new MediaLiveClient({ region: "ap-northeast-2" });
  const medialiveInputCommand = new CreateInputCommand({
    Name: inputName,
    Type: "RTMP_PUSH", // via RTMP PUSH, set application name and stream key
    InputSecurityGroups: [process.env.MEDIA_LIVE_INPUT_SECURITY_GROUP_ID],
    Destinations: [
      {
        StreamName: streamKey,
      },
    ],
  });
  const medialiveInputResponse = await medialiveClient.send(
    medialiveInputCommand
  );

  if (medialiveInputResponse.Input?.Id === undefined) {
    throw new Error("Failed to create MediaLive input");
  }

  if (medialiveInputResponse.Input?.Destinations?.[0].Url === undefined) {
    throw new Error("Failed to create MediaLive input destination");
  }

  return {
    Id: medialiveInputResponse.Input.Id,
    streamKey,
    serverUrl: medialiveInputResponse.Input.Destinations[0].Url,
  };
};

// 2. MediaPackage 채널 생성
export const createMediaPackageChannel = async ({
  channelName,
}: {
  channelName: string;
}) => {
  const mediapackageClient = new MediaPackageClient({
    region: "ap-northeast-2",
  });
  const createMediaPackageChannelCommand = new CreateMediaPackageChannelCommand(
    {
      Id: channelName,
      Description: `Channel for ${channelName}`,
    }
  );

  const createMediaPackageChannelResponse = await mediapackageClient.send(
    createMediaPackageChannelCommand
  );
  const mediaPackageChannelId = createMediaPackageChannelResponse.Id;

  if (mediaPackageChannelId === undefined) {
    throw new Error("Failed to create MediaPackage channel");
  }

  return {
    Id: mediaPackageChannelId,
  };
};

// 3. MediaPackage 엔드포인트 생성

export const createMediaPackageOriginEndpoint = async ({
  channelName,
  mediaPackageChannelId,
}: {
  channelName: string;
  mediaPackageChannelId: string;
}) => {
  const mediapackageClient = new MediaPackageClient({
    region: "ap-northeast-2",
  });
  const createOriginEndpointCommand = new CreateOriginEndpointCommand({
    ChannelId: mediaPackageChannelId,
    Id: `${channelName}-endpoint`,
    Description: `Endpoint for ${channelName}`,
    ManifestName: "index",
    StartoverWindowSeconds: 300,
    TimeDelaySeconds: 0,
    HlsPackage: {
      SegmentDurationSeconds: 6,
      PlaylistWindowSeconds: 60,
      PlaylistType: "EVENT",
    },
  });

  const createOriginEndpointResponse = await mediapackageClient.send(
    createOriginEndpointCommand
  );
  const originEndpointEndpointId = createOriginEndpointResponse.Id;

  if (originEndpointEndpointId === undefined) {
    throw new Error("Failed to create MediaPackage origin endpoint");
  }

  return {
    Id: originEndpointEndpointId,
  };
};

// 4. MediaLive 채널 생성
export const createMediaLiveChannel = async ({
  channelName,
  inputId,
  mediaPackageChannelId,
}: {
  channelName: string;
  inputId: string;
  mediaPackageChannelId: string;
}) => {
  const createMediaLiveChannelCommand = new CreateChannelCommand({
    Name: channelName,
    // RoleArn: "arn:aws:iam::123456789012:role/MediaLiveAccessRole", // 적절한 역할 ARN 입력
    InputSpecification: {
      Codec: "AVC",
      Resolution: "HD",
      MaximumBitrate: "MAX_10_MBPS",
    },
    InputAttachments: [
      {
        InputId: inputId, // Input ID
        InputSettings: {
          SourceEndBehavior: "CONTINUE",
        },
      },
    ],
    ChannelClass: "SINGLE_PIPELINE",
    Destinations: [
      {
        Id: "destination1",
        Settings: [],
        MediaPackageSettings: [
          {
            ChannelId: mediaPackageChannelId,
          },
        ],
      },
    ],
    EncoderSettings: {
      AudioDescriptions: [
        {
          AudioSelectorName: "default",
          CodecSettings: {
            AacSettings: {
              Bitrate: 64000,
              RawFormat: "NONE",
              Spec: "MPEG4",
            },
          },
          AudioTypeControl: "FOLLOW_INPUT",
          LanguageCodeControl: "FOLLOW_INPUT",
          Name: "audio_1_aac64",
        },
        {
          AudioSelectorName: "default",
          CodecSettings: {
            AacSettings: {
              Bitrate: 64000,
              RawFormat: "NONE",
              Spec: "MPEG4",
            },
          },
          AudioTypeControl: "FOLLOW_INPUT",
          LanguageCodeControl: "FOLLOW_INPUT",
          Name: "audio_2_aac64",
        },
        {
          AudioSelectorName: "default",
          CodecSettings: {
            AacSettings: {
              Bitrate: 64000,
              RawFormat: "NONE",
              Spec: "MPEG4",
            },
          },
          AudioTypeControl: "FOLLOW_INPUT",
          LanguageCodeControl: "FOLLOW_INPUT",
          Name: "audio_3_aac64",
        },
        {
          AudioSelectorName: "default",
          CodecSettings: {
            AacSettings: {
              Bitrate: 96000,
              RawFormat: "NONE",
              Spec: "MPEG4",
            },
          },
          AudioTypeControl: "FOLLOW_INPUT",
          LanguageCodeControl: "FOLLOW_INPUT",
          Name: "audio_1_aac96",
        },
        {
          AudioSelectorName: "default",
          CodecSettings: {
            AacSettings: {
              Bitrate: 96000,
              RawFormat: "NONE",
              Spec: "MPEG4",
            },
          },
          AudioTypeControl: "FOLLOW_INPUT",
          LanguageCodeControl: "FOLLOW_INPUT",
          Name: "audio_2_aac96",
        },
        {
          AudioSelectorName: "default",
          CodecSettings: {
            AacSettings: {
              Bitrate: 96000,
              RawFormat: "NONE",
              Spec: "MPEG4",
            },
          },
          AudioTypeControl: "FOLLOW_INPUT",
          LanguageCodeControl: "FOLLOW_INPUT",
          Name: "audio_3_aac96",
        },
        {
          AudioSelectorName: "default",
          CodecSettings: {
            AacSettings: {
              Bitrate: 128000,
              RawFormat: "NONE",
              Spec: "MPEG4",
            },
          },
          AudioTypeControl: "FOLLOW_INPUT",
          LanguageCodeControl: "FOLLOW_INPUT",
          Name: "audio_1_aac128",
        },
        {
          AudioSelectorName: "default",
          CodecSettings: {
            AacSettings: {
              Bitrate: 128000,
              RawFormat: "NONE",
              Spec: "MPEG4",
            },
          },
          AudioTypeControl: "FOLLOW_INPUT",
          LanguageCodeControl: "FOLLOW_INPUT",
          Name: "audio_2_aac128",
        },
        {
          AudioSelectorName: "default",
          CodecSettings: {
            AacSettings: {
              Bitrate: 128000,
              RawFormat: "NONE",
              Spec: "MPEG4",
            },
          },
          AudioTypeControl: "FOLLOW_INPUT",
          LanguageCodeControl: "FOLLOW_INPUT",
          Name: "audio_3_aac128",
        },
      ],
      CaptionDescriptions: [],
      OutputGroups: [
        {
          OutputGroupSettings: {
            MediaPackageGroupSettings: {
              Destination: {
                DestinationRefId: "destination1",
              },
            },
          },
          Name: channelName,
          Outputs: [
            {
              OutputSettings: {
                MediaPackageOutputSettings: {},
              },
              OutputName: "960_540",
              VideoDescriptionName: "video_960_540",
              AudioDescriptionNames: ["audio_2_aac96"],
              CaptionDescriptionNames: [],
            },
            {
              OutputSettings: {
                MediaPackageOutputSettings: {},
              },
              OutputName: "1280_720_1",
              VideoDescriptionName: "video_1280_720_1",
              AudioDescriptionNames: ["audio_3_aac96"],
              CaptionDescriptionNames: [],
            },
            {
              OutputSettings: {
                MediaPackageOutputSettings: {},
              },
              OutputName: "1280_720_2",
              VideoDescriptionName: "video_1280_720_2",
              AudioDescriptionNames: ["audio_1_aac128"],
              CaptionDescriptionNames: [],
            },
            {
              OutputSettings: {
                MediaPackageOutputSettings: {},
              },
              OutputName: "1280_720_3",
              VideoDescriptionName: "video_1280_720_3",
              AudioDescriptionNames: ["audio_2_aac128"],
              CaptionDescriptionNames: [],
            },
            {
              OutputSettings: {
                MediaPackageOutputSettings: {},
              },
              OutputName: "1920_1080",
              VideoDescriptionName: "video_1920_1080",
              AudioDescriptionNames: ["audio_3_aac128"],
              CaptionDescriptionNames: [],
            },
            {
              OutputSettings: {
                MediaPackageOutputSettings: {},
              },
              OutputName: "416_234",
              VideoDescriptionName: "video_416_234",
              AudioDescriptionNames: ["audio_1_aac64"],
              CaptionDescriptionNames: [],
            },
            {
              OutputSettings: {
                MediaPackageOutputSettings: {},
              },
              OutputName: "480_270",
              VideoDescriptionName: "video_480_270",
              AudioDescriptionNames: ["audio_2_aac64"],
              CaptionDescriptionNames: [],
            },
            {
              OutputSettings: {
                MediaPackageOutputSettings: {},
              },
              OutputName: "640_360",
              VideoDescriptionName: "video_640_360",
              AudioDescriptionNames: ["audio_3_aac64"],
              CaptionDescriptionNames: [],
            },
            {
              OutputSettings: {
                MediaPackageOutputSettings: {},
              },
              OutputName: "768_432",
              VideoDescriptionName: "video_768_432",
              AudioDescriptionNames: ["audio_1_aac96"],
              CaptionDescriptionNames: [],
            },
          ],
        },
      ],
      TimecodeConfig: {
        Source: "SYSTEMCLOCK",
      },
      VideoDescriptions: [
        {
          CodecSettings: {
            H264Settings: {
              AfdSignaling: "NONE",
              ColorMetadata: "INSERT",
              AdaptiveQuantization: "HIGH",
              Bitrate: 200000,
              EntropyEncoding: "CAVLC",
              FlickerAq: "ENABLED",
              ForceFieldPictures: "DISABLED",
              FramerateControl: "SPECIFIED",
              FramerateNumerator: 15000,
              FramerateDenominator: 1001,
              GopBReference: "DISABLED",
              GopClosedCadence: 1,
              GopNumBFrames: 0,
              GopSize: 30,
              GopSizeUnits: "FRAMES",
              SubgopLength: "FIXED",
              ScanType: "PROGRESSIVE",
              Level: "H264_LEVEL_3",
              LookAheadRateControl: "HIGH",
              NumRefFrames: 1,
              ParControl: "SPECIFIED",
              Profile: "BASELINE",
              RateControlMode: "CBR",
              Syntax: "DEFAULT",
              SceneChangeDetect: "ENABLED",
              SpatialAq: "ENABLED",
              TemporalAq: "ENABLED",
              TimecodeInsertion: "DISABLED",
            },
          },
          Height: 236,
          Name: "video_416_234",
          RespondToAfd: "NONE",
          Sharpness: 50,
          ScalingBehavior: "DEFAULT",
          Width: 416,
        },
        {
          CodecSettings: {
            H264Settings: {
              AfdSignaling: "NONE",
              ColorMetadata: "INSERT",
              AdaptiveQuantization: "HIGH",
              Bitrate: 400000,
              EntropyEncoding: "CAVLC",
              FlickerAq: "ENABLED",
              ForceFieldPictures: "DISABLED",
              FramerateControl: "SPECIFIED",
              FramerateNumerator: 15000,
              FramerateDenominator: 1001,
              GopBReference: "DISABLED",
              GopClosedCadence: 1,
              GopNumBFrames: 0,
              GopSize: 30,
              GopSizeUnits: "FRAMES",
              SubgopLength: "FIXED",
              ScanType: "PROGRESSIVE",
              Level: "H264_LEVEL_3",
              LookAheadRateControl: "HIGH",
              NumRefFrames: 1,
              ParControl: "SPECIFIED",
              Profile: "BASELINE",
              RateControlMode: "CBR",
              Syntax: "DEFAULT",
              SceneChangeDetect: "ENABLED",
              SpatialAq: "ENABLED",
              TemporalAq: "ENABLED",
              TimecodeInsertion: "DISABLED",
            },
          },
          Height: 272,
          Name: "video_480_270",
          RespondToAfd: "NONE",
          Sharpness: 50,
          ScalingBehavior: "DEFAULT",
          Width: 480,
        },
        {
          CodecSettings: {
            H264Settings: {
              AfdSignaling: "NONE",
              ColorMetadata: "INSERT",
              AdaptiveQuantization: "HIGH",
              Bitrate: 800000,
              EntropyEncoding: "CABAC",
              FlickerAq: "ENABLED",
              ForceFieldPictures: "DISABLED",
              FramerateControl: "SPECIFIED",
              FramerateNumerator: 30000,
              FramerateDenominator: 1001,
              GopBReference: "ENABLED",
              GopClosedCadence: 1,
              GopNumBFrames: 3,
              GopSize: 60,
              GopSizeUnits: "FRAMES",
              SubgopLength: "FIXED",
              ScanType: "PROGRESSIVE",
              Level: "H264_LEVEL_3",
              LookAheadRateControl: "HIGH",
              NumRefFrames: 1,
              ParControl: "SPECIFIED",
              Profile: "MAIN",
              RateControlMode: "CBR",
              Syntax: "DEFAULT",
              SceneChangeDetect: "ENABLED",
              SpatialAq: "ENABLED",
              TemporalAq: "ENABLED",
              TimecodeInsertion: "DISABLED",
            },
          },
          Height: 360,
          Name: "video_640_360",
          RespondToAfd: "NONE",
          Sharpness: 50,
          ScalingBehavior: "DEFAULT",
          Width: 640,
        },
        {
          CodecSettings: {
            H264Settings: {
              AfdSignaling: "NONE",
              ColorMetadata: "INSERT",
              AdaptiveQuantization: "HIGH",
              Bitrate: 1200000,
              EntropyEncoding: "CABAC",
              FlickerAq: "ENABLED",
              ForceFieldPictures: "DISABLED",
              FramerateControl: "SPECIFIED",
              FramerateNumerator: 30000,
              FramerateDenominator: 1001,
              GopBReference: "ENABLED",
              GopClosedCadence: 1,
              GopNumBFrames: 3,
              GopSize: 60,
              GopSizeUnits: "FRAMES",
              SubgopLength: "FIXED",
              ScanType: "PROGRESSIVE",
              Level: "H264_LEVEL_4_1",
              LookAheadRateControl: "HIGH",
              NumRefFrames: 1,
              ParControl: "SPECIFIED",
              Profile: "MAIN",
              RateControlMode: "CBR",
              Syntax: "DEFAULT",
              SceneChangeDetect: "ENABLED",
              SpatialAq: "ENABLED",
              TemporalAq: "ENABLED",
              TimecodeInsertion: "DISABLED",
            },
          },
          Height: 432,
          Name: "video_768_432",
          RespondToAfd: "NONE",
          Sharpness: 50,
          ScalingBehavior: "DEFAULT",
          Width: 768,
        },
        {
          CodecSettings: {
            H264Settings: {
              AfdSignaling: "NONE",
              ColorMetadata: "INSERT",
              AdaptiveQuantization: "HIGH",
              Bitrate: 2200000,
              EntropyEncoding: "CABAC",
              FlickerAq: "ENABLED",
              ForceFieldPictures: "DISABLED",
              FramerateControl: "SPECIFIED",
              FramerateNumerator: 30000,
              FramerateDenominator: 1001,
              GopBReference: "ENABLED",
              GopClosedCadence: 1,
              GopNumBFrames: 3,
              GopSize: 60,
              GopSizeUnits: "FRAMES",
              SubgopLength: "FIXED",
              ScanType: "PROGRESSIVE",
              Level: "H264_LEVEL_4_1",
              LookAheadRateControl: "HIGH",
              NumRefFrames: 1,
              ParControl: "SPECIFIED",
              Profile: "HIGH",
              RateControlMode: "CBR",
              Syntax: "DEFAULT",
              SceneChangeDetect: "ENABLED",
              SpatialAq: "ENABLED",
              TemporalAq: "ENABLED",
              TimecodeInsertion: "DISABLED",
            },
          },
          Height: 540,
          Name: "video_960_540",
          RespondToAfd: "NONE",
          Sharpness: 50,
          ScalingBehavior: "DEFAULT",
          Width: 960,
        },
        {
          CodecSettings: {
            H264Settings: {
              AfdSignaling: "NONE",
              ColorMetadata: "INSERT",
              AdaptiveQuantization: "HIGH",
              Bitrate: 3300000,
              EntropyEncoding: "CABAC",
              FlickerAq: "ENABLED",
              ForceFieldPictures: "DISABLED",
              FramerateControl: "SPECIFIED",
              FramerateNumerator: 30000,
              FramerateDenominator: 1001,
              GopBReference: "ENABLED",
              GopClosedCadence: 1,
              GopNumBFrames: 3,
              GopSize: 60,
              GopSizeUnits: "FRAMES",
              SubgopLength: "FIXED",
              ScanType: "PROGRESSIVE",
              Level: "H264_LEVEL_4_1",
              LookAheadRateControl: "HIGH",
              NumRefFrames: 1,
              ParControl: "SPECIFIED",
              Profile: "HIGH",
              RateControlMode: "CBR",
              Syntax: "DEFAULT",
              SceneChangeDetect: "ENABLED",
              SpatialAq: "ENABLED",
              TemporalAq: "ENABLED",
              TimecodeInsertion: "DISABLED",
            },
          },
          Height: 720,
          Name: "video_1280_720_1",
          RespondToAfd: "NONE",
          Sharpness: 50,
          ScalingBehavior: "DEFAULT",
          Width: 1280,
        },
        {
          CodecSettings: {
            H264Settings: {
              AfdSignaling: "NONE",
              ColorMetadata: "INSERT",
              AdaptiveQuantization: "HIGH",
              Bitrate: 4700000,
              EntropyEncoding: "CABAC",
              FlickerAq: "ENABLED",
              ForceFieldPictures: "DISABLED",
              FramerateControl: "SPECIFIED",
              FramerateNumerator: 30000,
              FramerateDenominator: 1001,
              GopBReference: "ENABLED",
              GopClosedCadence: 1,
              GopNumBFrames: 3,
              GopSize: 60,
              GopSizeUnits: "FRAMES",
              SubgopLength: "FIXED",
              ScanType: "PROGRESSIVE",
              Level: "H264_LEVEL_4_1",
              LookAheadRateControl: "HIGH",
              NumRefFrames: 1,
              ParControl: "SPECIFIED",
              Profile: "HIGH",
              RateControlMode: "CBR",
              Syntax: "DEFAULT",
              SceneChangeDetect: "ENABLED",
              SpatialAq: "ENABLED",
              TemporalAq: "ENABLED",
              TimecodeInsertion: "DISABLED",
            },
          },
          Height: 720,
          Name: "video_1280_720_2",
          RespondToAfd: "NONE",
          Sharpness: 50,
          ScalingBehavior: "DEFAULT",
          Width: 1280,
        },
        {
          CodecSettings: {
            H264Settings: {
              AfdSignaling: "NONE",
              ColorMetadata: "INSERT",
              AdaptiveQuantization: "HIGH",
              Bitrate: 6200000,
              EntropyEncoding: "CABAC",
              FlickerAq: "ENABLED",
              ForceFieldPictures: "DISABLED",
              FramerateControl: "SPECIFIED",
              FramerateNumerator: 30000,
              FramerateDenominator: 1001,
              GopBReference: "ENABLED",
              GopClosedCadence: 1,
              GopNumBFrames: 3,
              GopSize: 60,
              GopSizeUnits: "FRAMES",
              SubgopLength: "FIXED",
              ScanType: "PROGRESSIVE",
              Level: "H264_LEVEL_4_1",
              LookAheadRateControl: "HIGH",
              NumRefFrames: 1,
              ParControl: "SPECIFIED",
              Profile: "HIGH",
              RateControlMode: "CBR",
              Syntax: "DEFAULT",
              SceneChangeDetect: "ENABLED",
              SpatialAq: "ENABLED",
              TemporalAq: "ENABLED",
              TimecodeInsertion: "DISABLED",
            },
          },
          Height: 720,
          Name: "video_1280_720_3",
          RespondToAfd: "NONE",
          Sharpness: 50,
          ScalingBehavior: "DEFAULT",
          Width: 1280,
        },
        {
          CodecSettings: {
            H264Settings: {
              AfdSignaling: "NONE",
              ColorMetadata: "INSERT",
              AdaptiveQuantization: "HIGH",
              Bitrate: 8000000,
              EntropyEncoding: "CABAC",
              FlickerAq: "ENABLED",
              ForceFieldPictures: "DISABLED",
              FramerateControl: "SPECIFIED",
              FramerateNumerator: 30000,
              FramerateDenominator: 1001,
              GopBReference: "DISABLED",
              GopClosedCadence: 1,
              GopNumBFrames: 1,
              GopSize: 60,
              GopSizeUnits: "FRAMES",
              SubgopLength: "FIXED",
              ScanType: "PROGRESSIVE",
              Level: "H264_LEVEL_4_1",
              LookAheadRateControl: "HIGH",
              NumRefFrames: 1,
              ParControl: "SPECIFIED",
              Profile: "HIGH",
              RateControlMode: "CBR",
              Syntax: "DEFAULT",
              SceneChangeDetect: "ENABLED",
              SpatialAq: "ENABLED",
              TemporalAq: "ENABLED",
              TimecodeInsertion: "DISABLED",
            },
          },
          Height: 1080,
          Name: "video_1920_1080",
          RespondToAfd: "NONE",
          Sharpness: 50,
          ScalingBehavior: "DEFAULT",
          Width: 1920,
        },
      ],
    },
  });

  const medialiveClient = new MediaLiveClient({ region: "ap-northeast-2" });
  const createMediaLiveChannelResponse = await medialiveClient.send(
    createMediaLiveChannelCommand
  );
  const mediaLiveChannelId = createMediaLiveChannelResponse.Channel?.Id;

  if (mediaLiveChannelId === undefined) {
    throw new Error("Failed to create MediaLive channel");
  }

  return {
    Id: mediaLiveChannelId,
  };
};

// 5. MediaLive 채널 시작
export const startMediaLiveChannel = async ({
  ChannelId,
}: {
  ChannelId: string;
}) => {
  const medialiveClient = new MediaLiveClient({ region: "ap-northeast-2" });
  const startMediaLiveChannelCommand = new StartChannelCommand({
    ChannelId: ChannelId,
  });
  await medialiveClient.send(startMediaLiveChannelCommand);
};
