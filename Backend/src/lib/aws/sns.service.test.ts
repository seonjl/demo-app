import { publish, subscribe } from "./sns.service";

const NotifiTopicArn =
  "arn:aws:sns:ap-northeast-2:209479305079:notification-topic";
describe("subscribe", () => {
  test("publish", async () => {
    const result = await publish({
      Message: JSON.stringify({
        user_email: "seonjl.dev@gmail.com",
        payload: { hello: "world" },
      }),
      TopicArn: NotifiTopicArn,
      // TargetArn: NotifiTopicArn,
    });

    console.log("📢 result");
    console.log(result);
  });
  test("subscribe", async () => {
    const result = await subscribe({
      Protocol: "email",
      TopicArn:
        "arn:aws:sns:ap-northeast-2:905418160644:task-changed-notification-topic",
      Endpoint: "roy@example.com",
    });

    console.log("📢 result");
    console.log(result);
  });
});
