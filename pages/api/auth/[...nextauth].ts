import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccesToken(token: JWT) {
  try {
    spotifyApi.setAccessToken(token.accesToken ?? "");
    spotifyApi.setRefreshToken(token.refreshToken ?? "");

    const { body: refreshToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accesToken: refreshToken.access_token,
      accesTokenExpires: Date.now() + refreshToken.expires_in * 1000,
      refreshToken: refreshToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccesTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET ?? "",
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: async ({ token, account, user }) => {
      // Initial Sign-in
      if (account && user) {
        return {
          ...token,
          accesToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accesTokenExpires: account.expires_at ?? 1 * 1000,
        };
      }

      // Token has not expired yet
      if (Date.now() < (token.accesTokenExpires ?? "")) {
        return token;
      }

      // Acces token is expired
      return await refreshAccesToken(token);
    },
    session: async ({ session, token, user }) => {
      session.user.username = token.username;
      session.user.accesToken = token.accesToken;
      session.user.refreshToken = token.refreshToken;

      return session;
    },
  },
});
