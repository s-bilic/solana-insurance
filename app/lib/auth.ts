import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SigninMessage } from "../utils/signInMessage";
import { PrismaClient } from "@prisma/client";
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        try {
          const signinMessage = new SigninMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
          if (signinMessage.domain !== nextAuthUrl.host) {
            return null;
          }

          const csrfToken = await getCsrfToken({ req: { ...req, body: null } });

          if (signinMessage.nonce !== csrfToken) {
            return null;
          }

          const validationResult = await signinMessage.validate(
            credentials?.signature || ""
          );

          if (!validationResult)
            throw new Error("Could not validate the signed message");

          return {
            id: signinMessage.publicKey,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore
      session.publicKey = token.sub;
      if (session.user) {
        session.user.name = token.sub;
      }
      return session;
    },
  },
};
