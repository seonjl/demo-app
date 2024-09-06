// Importing necessary modules from AWS SDK
import { BaseDynamoDBClass } from "./base.repository.js";

export interface MediaRecord {
  user_email: string; // user_email
  input_id: string; // input_id
  channel_name: string; // channel_name
  media_package_channel_id: string; // media_package_channel_id
  media_live_channel_id: string; // media_live_channel_id
  media_package_origin_endpoint_id: string; // media_package_origin_endpoint_id
  stream_key: string; // stream_key
  server_url: string; // server_url
}

export class MediaRepository extends BaseDynamoDBClass {
  constructor() {
    super("MediaTable");
  }

  getMediaItem = async (user_email: string): Promise<MediaRecord> => {
    const params = {
      user_email,
    };

    const result = await this.getItem<MediaRecord>(params);
    return result;
  };

  listMediaItems = async (): Promise<MediaRecord[]> => {
    const result = await this.scanItems<MediaRecord>({});
    return result;
  };
}
