import { Context } from "aws-lambda";

export interface AuthorizedContext {
  lambda: {
    email: "roy@example.com";
  };
}

export interface ApiKeyVerifiedContext extends Context {
  user_email: string;
  scopes: string[];
}
