import { jsonSafeParse } from "@middy/util";
import { handler } from "./index.js";

describe("lambdaHandler", () => {
  test("should list issues", async () => {
    const mockEvent = {
      httpMethod: "GET",
      path: "/v1/issues",
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
  test("should list all issues", async () => {
    const mockEvent = {
      httpMethod: "GET",
      path: "/v1/issues?all=true",
      queryStringParameters: {
        all: true,
      },
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
