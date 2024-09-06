import { jsonSafeParse } from "@middy/util";
import { handler } from "./index.js";

describe("lambdaHandler", () => {
  test("should list notifications", async () => {
    const mockEvent = {
      httpMethod: "GET",
      path: "/v1/notifications",
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
