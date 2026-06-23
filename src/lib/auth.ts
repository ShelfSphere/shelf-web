import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./api";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        try {
          const res = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });
          const { user, accessToken, refreshToken } = res.data;
          return { ...user, accessToken, refreshToken };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile: _profile }, ...rest) {
      if (account?.provider === "google") {
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const pendingRole = cookieStore.get("pending_role")?.value ?? "PRODUCT_OWNER";

          const res = await api.post("/auth/google-signin", {
            googleId: account.providerAccountId,
            email: user.email,
            name: user.name,
            image: user.image,
            role: pendingRole,
          });
          const { accessToken, refreshToken, role } = res.data;
          (user as any).accessToken = accessToken;
          (user as any).refreshToken = refreshToken;
          (user as any).role = role;
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
