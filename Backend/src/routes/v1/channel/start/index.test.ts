import { jsonSafeParse } from "@middy/util";
import { handler } from "./index.js"; // ESM

describe("lambdaHandler", () => {
  test("should update the task", async () => {
    const mockEvent = {
      httpMethod: "POST",
      path: "/v1/channels/8746026/start",
      pathParameters: {
        channel_id: "8746026",
      },
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        authorization: "JS1A1.c1frPZS5or2gDiHJl9lQ_",
      },
      requestContext: {
        authorizer: {
          lambda: {
            email: "user.0epzyjhntkcj",
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
