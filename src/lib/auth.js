import CredentialsProvider from "next-auth/providers/credentials";
const bcrypt = require("bcrypt");
import { SignJWT } from "jose";
import { prisma } from "@/lib/config/prisma";
const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

async function authorizeUser(credentials) {
  const { email, password } = credentials;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("No user found with this email");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password); 
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    twoFactorEnabled: user.twoFactorEnabled,
  };
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await authorizeUser(credentials);
        if (user) return user;
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user?.email },
        });

        if (dbUser && dbUser.twoFactorEnabled) {
          user.requiresTwoFactor = true;
          return true;
        }
        return true;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        const payload = {
          id: user.id,
          email: user.email,
        };

        const customToken = await new SignJWT(payload)
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(secretKey);

        token.accessToken = customToken;

        if (user.requiresTwoFactor) {
          token.requiresTwoFactor = true;
        }

        if (trigger === "update" && session?.twoFactorVerified) {
          token.requiresTwoFactor = false;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      session.accessToken = token.accessToken;

      if (token.requiresTwoFactor) {
        session.requiresTwoFactor = true;
      }
      return session;
    },
  },
  secret: secretKey,
};
