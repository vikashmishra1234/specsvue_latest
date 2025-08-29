import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";

// Define auth options
export const authOptions: NextAuthOptions = {
  
  providers: [
    GoogleProvider({
      clientId: '707492812240-9ogsn6uh1ggmcqq5ejg1s32hp6ov3924.apps.googleusercontent.com',
      clientSecret: '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',
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, profile }) {
      try {
       

        const existingUser = await User.findOne({ userId: profile?.sub });
        
        if (!existingUser) {
          const newUser = new User({
            userId: profile?.sub,
            email: profile?.email,
            name: profile?.name,
            picture: profile?.picture,
            isVerified: profile?.email_verified,
            token: account?.access_token,
          });
          await newUser.save();
        }

        return true;
      } catch (err) {
        console.error("SignIn Error:", err);
        return false;
      }
    },
    async jwt({ token, user, account, profile }) {
      if (user && profile) {
        token.userId = profile.sub;
        token.email = user.email;
        token.name = user.name;
        token.picture = profile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.picture = token.picture as string;
      }
      return session;
    },
  },
};

// Required for App Router in Next.js 14+
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
