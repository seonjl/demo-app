import { BaseDynamoDBClass } from "./base.repository.js";

export interface FileRecord {
  user_email: string; // pk
  id: string; // sk
  created_at: string; // gsi1 sk
  name: string;
  size: string;
  bucket: string;
  key: string;
  uploaded_at: string;
}

export class FileRepository extends BaseDynamoDBClass {
  constructor() {
    super("FileTable");
  }

  async listFiles({
    user_email: _user_email,
    created_at,
  }: {
    user_email: string;
    created_at?: string;
  }) {
    const user_email = _user_email;

    return this.queryItems({
      IndexName: "createdAtIndex",
      KeyConditionExpression: "#user_email = :user_email",
      ExpressionAttributeNames: {
        "#user_email": "user_email",
      },
      ExpressionAttributeValues: {
        ":user_email": user_email,
      },
      ScanIndexForward: false,
      Limit: 10,
    });
  }

  async createFile(
    user_email: string,
    {
      id,
      name,
      size,
      bucket,
      key,
    }: { id: string; name: string; size: string; bucket: string; key: string }
  ) {
    const current = new Date().toISOString();
    return this.putItem({
      user_email,
      id: id,
      created_at: current,
      name,
      size,
      bucket,
      key,
      uploaded_at: current,
    });
  }

  async getFile(_user_email: string, file_id: string) {
    const user_email = _user_email;
    return this.getItem<FileRecord>({ user_email, id: file_id });
  }
}
