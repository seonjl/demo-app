import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBStreamEvent } from "aws-lambda";
import { publish } from "../../lib/aws/sns.service.js";
import { ChatRecord } from "../../lib/ddb/chat/chat.repository.js";

export async function handler(event: DynamoDBStreamEvent) {
  const topicArn = process.env.NOTIFICATION_TOPIC_ARN;
  if (!topicArn) {
    throw new Error("NOTIFICATION_TOPIC_ARN is not defined");
  }

  const recordPromises = event.Records.map(async (record, index) => {
    if (record.eventName === "INSERT") {
      const _newImage = record.dynamodb?.NewImage;

      if (_newImage === undefined) {
        return;
      }

      const newImage = unmarshall(_newImage as any) as ChatRecord;

      if (!newImage) {
        return;
      }

      const message = {
        user_email: newImage.user_email,
        payload: { message_type: "refetch_chat", room_id: newImage.room_id },
      };
      await publish({
        Message: JSON.stringify(message),
        TopicArn: topicArn,
      });
    }
  });

  return Promise.allSettled(recordPromises);
}
