import { randomId, removeUndefined } from "../util/index.js";
import { BaseDynamoDBClass } from "./base.repository.js";

// prettier-ignore
export interface IssueRecord {
  user_email     : string;    // user_email pk
  created_at     : string;    // created_at sk 
  id             : string;    // issue.{id}
  title          : string;
  description    : string;
  subscribers?   : string[];  // user_email
}

export class IssueRepository extends BaseDynamoDBClass {
  constructor() {
    super("IssueTable");
  }

  async listAllIssues() {
    return this.scanItems<IssueRecord>({});
  }

  async listMyIssues({ user_email }: { user_email?: string }) {
    return this.queryItems<IssueRecord>({
      IndexName: "userEmailIndex",
      KeyConditionExpression: "#user_email = :user_email",
      ExpressionAttributeNames: {
        "#user_email": "user_email",
      },
      ExpressionAttributeValues: {
        ":user_email": user_email,
      },
      ScanIndexForward: false,
    });
  }

  async createIssue(
    user_email: string,
    { title, description }: Pick<IssueRecord, "title" | "description">
  ) {
    const issueId = randomId({ prefix: "issue" });
    return this.putItem({
      user_email,
      id: issueId,
      title,
      description,
      subscribers: [
        user_email, // creator is automatically subscribed
      ],
    });
  }

  async updateIssue(
    { user_email, issue_id }: { user_email: string; issue_id: string },
    { title, description }: Partial<IssueRecord>,
    { subscriber }: { subscriber?: string } = {}
  ) {
    const UpdateExpression = "SET ".concat(
      Object.entries({ title, description })
        .filter(([_, value]) => value !== undefined)
        .map(([key]) => `${key} = :${key}`)
        .join(", "),
      subscriber ? `, subscribers = list_append(subscribers, :subscriber)` : ""
    );

    return this.updateItemNew({
      Key: { id: issue_id },
      UpdateExpression: UpdateExpression,
      ConditionExpression: "#user_email = :user_email",
      ExpressionAttributeNames: { "#user_email": "user_email" },
      ExpressionAttributeValues: removeUndefined({
        ":user_email": user_email,
        ":title": title,
        ":description": description,
        // ":subscriber": [subscriber],
      }),
    });
  }

  async subscribeIssue(
    { issue_id }: { issue_id: string },
    { subscriber }: { subscriber: string }
  ) {
    return this.updateItem({
      Key: { id: issue_id },
      UpdateExpression:
        "SET subscribers = list_append(subscribers, :subscriber)",
      ExpressionAttributeValues: removeUndefined({
        ":subscriber": [subscriber],
      }),
    });
  }

  async unsubscribeIssue(
    { issue_id }: { issue_id: string },
    { subscriber }: { subscriber?: string } = {}
  ) {
    const issue = await this.getItem<IssueRecord>({ id: issue_id });

    const subscriberIndex = issue.subscribers?.findIndex(
      (email) => email === subscriber
    );

    return this.updateItemNew({
      Key: { id: issue_id },
      UpdateExpression: "REMOVE subscribers[" + subscriberIndex + "]",
    });
  }

  async deleteIssue(user_email: string, issue_id: string) {
    return this.deleteItemNew({
      Key: { id: issue_id },
      ConditionExpression: "#user_email = :user_email",
      ExpressionAttributeNames: { "#user_email": "user_email" },
      ExpressionAttributeValues: { ":user_email": user_email },
    });
  }
}
