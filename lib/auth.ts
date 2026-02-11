import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SessionUser = User & {
  id: string;
  username: string;
  role: string;
  status: string;
  forceChangePassword: boolean;
  passwordExpired: boolean;
};

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const rows = await prisma.$queryRawUnsafe<any[]>(
          `SELECT * FROM users WHERE username = $1 LIMIT 1`,
          credentials.username
        );

        const user = rows[0];
        if (!user || user.status !== "active") return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        if (!valid) return null;

        const now = new Date();
        const passwordExpired =
          user.password_expires_at &&
          new Date(user.password_expires_at) < now;

        // ✅ UBAH: last_login → last_login_at
        await prisma.users.update({
          where: { id: user.id },
          data: { last_login_at: now },
        });

        return {
          id: user.id,
          username: user.username,
          role: user.role,
          status: user.status,
          forceChangePassword: user.force_change_password,
          passwordExpired,
        } as SessionUser;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as SessionUser;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};