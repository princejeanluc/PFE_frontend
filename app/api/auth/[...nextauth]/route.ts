import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios";
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
                        // 1. Récupération des tokens
                        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/token/`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(credentials),
                        });
                        
                        if (!res.ok) return null;

                        const tokens = await res.json(); // { access, refresh }
                        // 2. Appel à /auth/user/ avec le token pour récupérer l'utilisateur
                        const userRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/`, {
                          headers: {
                            Authorization: `Bearer ${tokens.access}`,
                          },
                        });

                        if (!userRes.ok) return null;

                        const user = await userRes.json();
                        return {
                          id: user.id,
                          name: user.username, // ou user.first_name si dispo
                          email: user.email,
                          accessToken: tokens.access,
                          refreshToken: tokens.refresh,
                        };
                      } catch (err) {
                        console.error("Erreur dans authorize:", err);
                        return null;
                      }
                    },
      })
    ,
  ],
    callbacks: {
    async jwt({ token, user, account}) {
      if (account?.provider === 'google') {
        // Ici, l'utilisateur vient juste de se connecter
        // console.log("google provider called")
        const accessToken = account.access_token;

        try {
          // 🔥 Appel à ton backend Django
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google/token/`, {
            access_token: accessToken,
          });
          token.accessToken = response.data.access; 
          token.refreshToken = response.data.refresh;
          token.id = response.data.user.id;
          token.email  = response.data.user.email;
          token.username = response.data.user.username;
        } catch (error) {
          console.error("Erreur lors de l'appel au backend", error);
        }
      }
      if (user && user.accessToken && user.refreshToken) {
        // console.log("user has been called jwt")
        token.id = user.id;
        token.name = user.username || user.name;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      // console.log("jwt called")
      // console.log("token", token)

      return token;
    },

    async session({ session, token }) {
      // console.log("session called")
      // console.log("token in session" , token)
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.username = token.username;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      
      return session;
    },
    async redirect({ }) {
    // On redirige toujours vers le dashboard après login
    return '/dashboard/market';
    }
  },
  pages:{
    signIn:'/login', 
    error : '/api/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
