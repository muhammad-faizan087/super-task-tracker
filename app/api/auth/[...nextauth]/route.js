import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongoose";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDB();

        const user = await UserModel.findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return {
          userId: user.userId,
          email: user.email,
          name: user.name,
          role: user.role,
          _id: user._id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.userId;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token._id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        userId: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        _id: token._id,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
