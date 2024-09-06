import middy from "@middy/core";
import { getUserInfoByGoogle } from "../../lib/google/oauth.service.js";

export async function lambdaHandler(
  event: {
    headers: { authorization: string };
  },
  context: any
) {
  const token = event.headers.authorization.split(" ")[1];

  return await getUserInfoByGoogle(token)
    .then((userInfo) => {
      return {
        isAuthorized: true,
        context: {
          email: userInfo.email,
        },
      };
    })
    .catch((e) => {
      return context.fail("Unauthorized");
    });
}

export const handler = middy().handler(lambdaHandler);
