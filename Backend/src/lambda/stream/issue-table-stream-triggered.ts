import type { DynamoDBStreamEvent } from "aws-lambda";

import { unmarshall } from "@aws-sdk/util-dynamodb";
import { IssueRecord } from "../../lib/ddb/issue.repository.js";
import { NotificationRepository } from "../../lib/ddb/notification.repository.js";

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
const notificationRepository = new NotificationRepository();
export async function handler(event: DynamoDBStreamEvent) {
  const recordPromises = event.Records.map(async (record, index) => {
    if (record.eventName === "MODIFY") {
      const _newImage = record.dynamodb?.NewImage;

      if (_newImage === undefined) {
        return;
      }

      const newImage = unmarshall(_newImage as any) as IssueRecord;

      if (!newImage) {
        return;
      }

      for (
        let i = 0;
        newImage.subscribers && i < newImage.subscribers.length;
        i++
      ) {
        await notificationRepository.createNotificationItem({
          user_email: newImage.subscribers[i],
          title: "Issue Updated",
          description: newImage.title,
        });
      }
    }
  });

  return Promise.allSettled(recordPromises);
}
