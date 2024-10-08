import { faker } from "@faker-js/faker";
import { jsonSafeParse } from "@middy/util";
import { handler } from "./index.js"; // ESM

describe("lambdaHandler", () => {
  test("should update the issue", async () => {
    const mockEvent = {
      httpMethod: "PUT",
      path: "/v1/issues/issue.qs00irumu4m",
      pathParameters: {
        issue_id: "issue.qs00irumu4m",
      },
      body: JSON.stringify({
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        issue_status: "DONE",
        due_date: faker.date.future(),
      }),
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
