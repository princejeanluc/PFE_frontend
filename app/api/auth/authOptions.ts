import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { JWT } from "next-auth/jwt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!res.ok) return null;

          const tokens = await res.json();
          const userRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/`, {
            headers: {
              Authorization: `Bearer ${tokens.access}`,
            },
          });

          if (!userRes.ok) return null;

          const user = await userRes.json();
          return {
            id: user.id,
            name: user.username,
            email: user.email,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
          };
        } catch (err) {
          console.error("Erreur dans authorize:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: any | null; account?: any | null }) {
      if (account?.provider === "google") {
        const accessToken = account.access_token;

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google/token/`,
            {
              access_token: accessToken,
            }
          );
          token.accessToken = response.data.access;
          token.refreshToken = response.data.refresh;
          token.id = response.data.user.id;
          token.email = response.data.user.email;
          token.username = response.data.user.username;
        } catch (error) {
          console.error("Erreur lors de l'appel au backend", error);
        }
      }
      if (user?.accessToken && user?.refreshToken) {
        token.id = user.id;
        token.name = user.username || user.name;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.username = token.username;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
    async redirect({ url, baseUrl }: { url: any; baseUrl: any }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.origin === baseUrl) {
          return url;
        }
      } catch (error) {
        console.error("Invalid URL in redirect:", url, `${error}`);
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "auth/login",
    error: "auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
