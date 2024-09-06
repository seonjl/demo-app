import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBStreamEvent } from "aws-lambda";

import { publish } from "../../lib/aws/sns.service.js";

// {
//   Records: [
//     {
//       eventID: 'ca821c0a683fca30d570fc6e320af2ef',
//       eventName: 'INSERT',
//       eventVersion: '1.1',
//       eventSource: 'aws:dynamodb',
//       awsRegion: 'ap-northeast-2',
//       dynamodb: [{
//         ApproximateCreationDateTime: 1722402388,
//         Keys: {
//           sk: { S: '2024-07-31T04:58:41.318Z' },
//           pk: { S: 'seonjl.dev@gmail.com' }
//         },
//         NewImage: {
//           last_logged_in_at: { S: '2024-07-31T05:06:28.172Z' },
//           entity_type: { S: 'user' },
//           updated_at: { S: '2024-07-31T05:06:28.221Z' },
//           provider: { S: 'google' },
//           sk: { S: '2024-07-31T04:58:41.318Z' },
//           created_at: { S: '2024-07-31T05:06:28.221Z' },
//           pk: { S: 'seonjl.dev@gmail.com' }
//         },
//         SequenceNumber: '300000000017052762000',
//         SizeBytes: 234,
//         StreamViewType: 'NEW_IMAGE'
//       }],
//       eventSourceARN: 'arn:aws:dynamodb:ap-northeast-2:905418160644:table/TMSSystemTable/stream/2024-07-31T04:45:27.128'
//     }
//   ]
// }
export async function handler(event: DynamoDBStreamEvent) {
  const topicArn = process.env.NOTIFICATION_TOPIC_ARN;
  if (!topicArn) {
    throw new Error("NOTIFICATION_TOPIC_ARN is not defined");
  }

  const recordPromises = event.Records.map(async (record, index) => {
    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      if (!record.dynamodb?.NewImage) {
        return;
      }

      const newImage = unmarshall(record.dynamodb.NewImage as any);

      if (!newImage) {
        return;
      }

      if (newImage.user_email) {
        const message = {
          user_email: newImage.user_email,
          payload: { message_type: "refetch_notification" },
        };
        await publish({
          Message: JSON.stringify(message),
          TopicArn: topicArn,
        });
      }
    }
  });

  return Promise.allSettled(recordPromises);
}
