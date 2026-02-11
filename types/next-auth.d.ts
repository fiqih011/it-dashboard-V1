import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      status: string;
      forceChangePassword: boolean;
      passwordExpired: boolean;
    };
  }

  interface User {
    id: string;
    username: string;
    role: string;
    status: string;
    forceChangePassword: boolean;
    passwordExpired: boolean;
  }
}
