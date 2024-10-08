import { FileRepository } from "../../lib/ddb/file.repository.js";
import { randomId } from "../../lib/util/index.js";

type TEvent = {
  Records: [
    {
      eventVersion: "2.2";
      eventSource: "aws:s3";
      awsRegion: "us-west-2";
      eventTime: "The time, in ISO-8601 format, for example, 1970-01-01T00:00:00.000Z, when Amazon S3 finished processing the request";
      eventName: "event-type";
      userIdentity: {
        principalId: "Amazon-customer-ID-of-the-user-who-caused-the-event";
      };
      requestParameters: {
        sourceIPAddress: "ip-address-where-request-came-from";
      };
      responseElements: {
        "x-amz-request-id": "Amazon S3 generated request ID";
        "x-amz-id-2": "Amazon S3 host that processed the request";
      };
      s3: {
        s3SchemaVersion: "1.0";
        configurationId: "ID found in the bucket notification configuration";
        bucket: {
          name: "bucket-name";
          ownerIdentity: {
            principalId: "Amazon-customer-ID-of-the-bucket-owner";
          };
          arn: "bucket-ARN";
        };
        object: {
          key: "object-key";
          size: "object-size in bytes";
          eTag: "object eTag";
          versionId: "object version if bucket is versioning-enabled, otherwise null";
          sequencer: "a string representation of a hexadecimal value used to determine event sequence, only used with PUTs and DELETEs";
        };
      };
      glacierEventData: {
        restoreEventData: {
          lifecycleRestorationExpiryTime: "The time, in ISO-8601 format, for example, 1970-01-01T00:00:00.000Z, of Restore Expiry";
          lifecycleRestoreStorageClass: "Source storage class for restore";
        };
      };
    }
  ];
};

const fileRepository = new FileRepository();

export async function handler(event: TEvent) {
  const recordPromises = event.Records.map(async (record, index) => {
    const bucket = record.s3.bucket.name;
    const encoded_key = record.s3.object.key;
    const key = decodeURIComponent(encoded_key);

    const [encoded_user_email, name] = encoded_key.split("/");
    const user_email = decodeURIComponent(encoded_user_email);

    const fileId = randomId({ prefix: "file" });
    await fileRepository.createFile(user_email, {
      id: fileId,
      name: name,
      size: event.Records[0].s3.object.size,
      bucket,
      key,
    });
  });

  return Promise.allSettled(recordPromises);
}
