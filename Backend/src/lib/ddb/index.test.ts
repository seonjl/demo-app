import { faker } from "@faker-js/faker";

import { IssueRepository } from "./issue.repository";
import { NotificationRepository } from "./notification.repository";

describe("NotificationRepository", () => {
  const notiRepository = new NotificationRepository();
  test("create noti", async () => {
    const message = faker.lorem.lines(1);

    await notiRepository.createNotificationItem({
      user_email: "seonjl.dev@gmail.com",
      title: "New Message",
      description: message,
    });
  });
  test("create noti", async () => {
    const message = faker.lorem.lines(1);

    await notiRepository.readNotificationItem(
      "seonjl.dev@gmail.com",
      "notification.uc0z0cqfdn"
    );
  });
});

describe("IssueRepository", () => {
  const issueRepository = new IssueRepository();
  test("updateIssue", async () => {
    await issueRepository.updateIssue(
      {
        user_email: "seonjl.dev@gmail.com",
        issue_id: "issue.uc0z0cqfdn",
      },
      {
        title: "New Issue",
      }
    );
  });
  test("subscribeIssue", async () => {
    await issueRepository.subscribeIssue(
      {
        issue_id: "issue.uc0z0cqfdn",
      },
      {
        subscriber: "seonjl.dev@gmail.com",
      }
    );
  });
  test("unsubscribe", async () => {
    await issueRepository.unsubscribeIssue(
      {
        issue_id: "issue.uc0z0cqfdn",
      },
      {
        subscriber: "seonjl.dev@gmail.com",
      }
    );
  });
});
