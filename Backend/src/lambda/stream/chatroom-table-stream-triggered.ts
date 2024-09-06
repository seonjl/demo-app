import type { DynamoDBStreamEvent } from "aws-lambda";

import { unmarshall } from "@aws-sdk/util-dynamodb";
import { publish } from "../../lib/aws/sns.service.js";
import { ChatRoomRecord } from "../../lib/ddb/chat/chatroom.repository.js";

export async function handler(event: DynamoDBStreamEvent) {
  const topicArn = process.env.NOTIFICATION_TOPIC_ARN;
  if (!topicArn) {
    throw new Error("NOTIFICATION_TOPIC_ARN is not defined");
  }

  const recordPromises = event.Records.map(async (record, index) => {
    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      const _newImage = record.dynamodb?.NewImage;

      if (_newImage === undefined) {
        return;
      }

      const newImage = unmarshall(_newImage as any) as ChatRoomRecord;

      console.log(newImage);
      if (!newImage) {
        return;
      }

      if (newImage.badge_count === 0) {
        // if badge_count is 0, no need to refetch chatroom
        return;
      }

      const message = {
        user_email: newImage.user_email,
        payload: {
          message_type: "refetch_chatroom",
        },
      };
      await publish({
        Message: JSON.stringify(message),
        TopicArn: topicArn,
      });
    }
  });

  return Promise.allSettled(recordPromises);
}
