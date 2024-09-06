import { getAccessToken } from "@/lib/utils";
import {
  AuthApi,
  ChatApi,
  Configuration,
  FileApi,
  IssueApi,
  MeApi,
  NotificationApi,
  RequestContext,
  ResponseContext,
  TaskApi,
} from "./client";

const setAccessTokenIntoAuthorizationHeaderMiddleware = async (
  context: RequestContext
) => {
  const accessToken = getAccessToken();

  context.init.headers = {
    ...context.init.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  return;
};

const backToLoginPageIfUnauthorizedMiddleware = async (
  context: ResponseContext
) => {
  if (context.response?.status === 401) {
    window.location.href = "/login";
  }
};

export const authApiClient = new AuthApi(new Configuration({}));
export const taskApiClient = new TaskApi(new Configuration({}))
  .withPreMiddleware(setAccessTokenIntoAuthorizationHeaderMiddleware)
  .withPostMiddleware(backToLoginPageIfUnauthorizedMiddleware);
export const issueApiClient = new IssueApi(new Configuration({}))
  .withPreMiddleware(setAccessTokenIntoAuthorizationHeaderMiddleware)
  .withPostMiddleware(backToLoginPageIfUnauthorizedMiddleware);
export const meApiClient = new MeApi(new Configuration({})).withPreMiddleware(
  setAccessTokenIntoAuthorizationHeaderMiddleware
);
export const fileApiClient = new FileApi(
  new Configuration({
    fetchApi: fetch,
  })
)
  .withPreMiddleware(setAccessTokenIntoAuthorizationHeaderMiddleware)
  .withPostMiddleware(backToLoginPageIfUnauthorizedMiddleware);
export const chatApiClient = new ChatApi(new Configuration({}))
  .withPreMiddleware(setAccessTokenIntoAuthorizationHeaderMiddleware)
  .withPostMiddleware(backToLoginPageIfUnauthorizedMiddleware);

export const notificationApiClient = new NotificationApi(new Configuration({}))
  .withPreMiddleware(setAccessTokenIntoAuthorizationHeaderMiddleware)
  .withPostMiddleware(backToLoginPageIfUnauthorizedMiddleware);
