
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null; // User not found or no password set (e.g. social login user)
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        // Return user object that will be stored in the session/JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role, // Add role here
        };
      },
    }),
    // Add other providers like Google, GitHub etc. here if needed
  ],
  session: {
    strategy: "jwt", // Use JWT for session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user object exists (on sign in), add custom properties to token
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole; // Cast if User type from next-auth doesn't have role
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom properties to session from the JWT token
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.email = token.email as string | null | undefined;
        session.user.name = token.name as string | null | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect users to /login page
    // error: '/auth/error', // Error code passed in query string as ?error=
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable the feature)
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
