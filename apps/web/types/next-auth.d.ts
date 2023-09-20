import { DefaultSession } from "next-auth";

declare module "next-auth" {
  export type Session = DefaultSession & {
    accessToken: string;
  };
}
