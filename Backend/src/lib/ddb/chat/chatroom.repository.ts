// Importing necessary modules from AWS SDK
import { removeUndefined } from "../../util/index.js";
import { BaseDynamoDBClass } from "../base.repository.js";

export interface ChatRoomRecord {
  room_id: string; // pk1
  user_email: string; // pk2
  last_chatted_at: string; // sk
  last_message: string;
  badge_count: number;
  room_name?: string;
  members?: string[];
}

export class ChatRoomRepository extends BaseDynamoDBClass {
  constructor() {
    super("ChatRoomTable");
  }

  async createChatRoom(
    { room_id, user_email }: { room_id: string; user_email: string },
    { last_message, badge_count, room_name, members }: Partial<ChatRoomRecord>
  ) {
    const isoDate = new Date().toISOString();

    // upsert
    return this.putItem({
      room_id,
      user_email,
      last_chatted_at: isoDate,
      last_message,
      badge_count,
      room_name,
      members,
    });
  }

  async updateChatRoomBadgeCountIntoZero({
    room_id,
    user_email,
  }: {
    room_id: string;
    user_email: string;
  }) {
    return this.updateItemNew({
      Key: {
        room_id,
        user_email,
      },
      UpdateExpression: "SET badge_count = :badge_count",
      ExpressionAttributeValues: {
        ":badge_count": 0,
      },
    });
  }

  async updateChatRoom(
    { room_id, user_email }: { room_id: string; user_email: string },
    {
      last_message,
      badge_count,
      badge_count_increment,
    }: Partial<ChatRoomRecord> & { badge_count_increment?: number }
  ) {
    if (badge_count && badge_count_increment) {
      throw new Error(
        "badge_count and badge_count_increment cannot be used together"
      );
    }
    const UpdateExpression = "SET ".concat(
      last_message ? "last_message = :last_message, " : "",
      "last_chatted_at = :last_chatted_at, ",
      badge_count_increment
        ? "badge_count = badge_count + :badge_count"
        : "badge_count = :badge_count"
    );

    return this.updateItem({
      Key: {
        room_id,
        user_email,
      },
      UpdateExpression,
      ExpressionAttributeValues: removeUndefined({
        ":last_message": last_message,
        ":last_chatted_at": new Date().toISOString(),
        ":badge_count": badge_count_increment
          ? badge_count_increment
          : badge_count,
      }),
    });
  }

  async listChatRooms(user_email: string) {
    return this.queryItems<ChatRoomRecord>({
      IndexName: "userEmailIndex",
      KeyConditionExpression: "user_email = :user_email",
      ExpressionAttributeValues: {
        ":user_email": user_email,
      },
      ScanIndexForward: false,
    });
  }

  async getChatRoom(room_id: string, user_email: string) {
    return this.getItem<ChatRoomRecord>({
      room_id,
      user_email,
    });
  }
}
