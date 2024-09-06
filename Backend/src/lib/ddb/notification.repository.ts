// Importing necessary modules from AWS SDK
import { randomId } from "../util/index.js";
import { BaseDynamoDBClass } from "./base.repository.js";

// prettier-ignore
export interface NotificationRecord {
  user_email  : string;   // user_email pk
  created_at  : string;   // created_at sk gsi1pk
  id          : string;   // id            gsi1sk
  is_read     : boolean;  // is_read
  title       : string;   // title
  description : string;   // description
}

export class NotificationRepository extends BaseDynamoDBClass {
  constructor() {
    super("NotificationTable");
  }

  listNotificationItems = async ({ user_email }: { user_email: string }) => {
    const result = await this.queryItems<NotificationRecord>({
      IndexName: "userEmailIndex",
      KeyConditionExpression: "user_email = :user_email",
      ExpressionAttributeValues: {
        ":user_email": user_email,
      },
    });
    return result;
  };

  readNotificationItem = async (user_email: string, id: string) => {
    const result = await this.updateItemNew({
      Key: {
        id,
      },
      UpdateExpression: "SET is_read = :is_read",
      ConditionExpression: "#user_email = :user_email",
      ExpressionAttributeNames: {
        "#user_email": "user_email",
      },
      ExpressionAttributeValues: {
        ":is_read": true,
        ":user_email": user_email,
      },
    });
    return result;
  };

  createNotificationItem = async ({
    user_email,
    title,
    description,
  }: Pick<NotificationRecord, "user_email" | "title" | "description">) => {
    const result = await this.putItem({
      user_email,
      created_at: new Date().toISOString(),
      id: randomId(),
      is_read: false,
      title,
      description,
    });
    return result;
  };
}
