// Importing necessary modules from AWS SDK
import { BaseDynamoDBClass } from "../base.repository.js";

export interface ChatRecord {
  room_id: string; // pk1
  created_at: string; // sk
  message: string;
  user_email: string;
}

export class ChatRepository extends BaseDynamoDBClass {
  constructor() {
    super("ChatTable");
  }

  async createChat({
    room_id,
    user_email,
    message,
  }: {
    room_id: string;
    user_email: string;
    message: string;
  }) {
    const isoDate = new Date().toISOString();
    return this.putItem({
      room_id,
      user_email,
      created_at: isoDate,
      message,
    });
  }

  async listChats(
    room_id: string,
    {
      Limit,
      ExclusiveStartKey,
    }: {
      Limit?: number;
      ExclusiveStartKey?: { room_id: string; created_at: string };
    } = {}
  ) {
    return this.queryItems<ChatRecord>({
      KeyConditionExpression: "room_id = :room_id",
      ExpressionAttributeValues: {
        ":room_id": room_id,
      },
      ScanIndexForward: false,
      ExclusiveStartKey: ExclusiveStartKey,
      Limit,
    });
  }

  async updateChat(
    room_id: string,
    {
      created_at,
      message,
    }: {
      created_at: string;
      message: string;
    }
  ) {
    return this.updateItem({
      Key: {
        room_id,
        created_at,
      },
      UpdateExpression: "SET message = :message",
      ExpressionAttributeValues: {
        ":message": message,
      },
    });
  }

  async deleteChat(room_id: string, created_at: string) {
    return this.deleteItem({
      room_id,
      created_at,
    });
  }
}
