import { jsonSafeParse } from "@middy/util";
import { handler } from "./index.js";

describe("lambdaHandler", () => {
  test("should list chats", async () => {
    const room_id = "0.j6r5.xlfbbrasbdb";
    const mockEvent = {
      httpMethod: "GET",
      path: `/v1/chatrooms/${room_id}`,
      pathParameters: {
        room_id,
      },
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
