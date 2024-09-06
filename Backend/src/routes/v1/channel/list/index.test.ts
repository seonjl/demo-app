import { jsonSafeParse } from "@middy/util";
import { handler } from "./index.js";

describe("lambdaHandler", () => {
  test("should list channels", async () => {
    const mockEvent = {
      httpMethod: "GET",
      path: "/v1/channels",
      headers: {
        "Content-Type": "application/json",
      },
      requestContext: {
        authorizer: {
          lambda: {
            email: "user.fatc4vtp5ut",
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
