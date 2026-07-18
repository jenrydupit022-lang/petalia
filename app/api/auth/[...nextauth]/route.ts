import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          credentials?.username === "admin" &&
          credentials?.password === "petalia123"
        ) {
          return {
            id: "1",
            name: "Administrator",
          };
        }

        return null;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };