import { jsonSafeParse } from "@middy/util";
import { handler } from "./index.js"; // ESM

describe("lambdaHandler", () => {
  test("should create a url for download", async () => {
    const mockEvent = {
      httpMethod: "POST",
      path: "/v1/notifications/download",
      body: JSON.stringify({
        notificationId: "notification.m8ke4o5vip",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      requestContext: {
        authorizer: {
          lambda: {
            email: "seonjl.dev@gmail.com",
          },
        },
      },
    };

    const context = {};

    const response = await handler(mockEvent as any, context as any);
    const result = jsonSafeParse(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();

    console.log("📢 result");
    console.log(result);
  });
});
