import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/dbConnect";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: '707492812240-9ogsn6uh1ggmcqq5ejg1s32hp6ov3924.apps.googleusercontent.com',
      clientSecret: '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',
    }),
    CredentialsProvider({
        name: "OTP Login",
        credentials: {
          email: { label: "Email", type: "text" },
          otp: { label: "OTP", type: "text" },
        },
        async authorize(credentials) {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials?.email });
  
          if (!user) {
            throw new Error("User not found");
          }
  
          // Check OTP
          if (!user.otp || user.otp !== credentials?.otp) {
             throw new Error("Invalid OTP");
          }
  
          // Check Expiry
          if (user.otpExpiry && new Date() > user.otpExpiry) {
             throw new Error("OTP Expired");
          }
  
          // Clear OTP after successful login
          user.otp = undefined;
          user.otpExpiry = undefined;
          await user.save();
  
          return user;
        },
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
        if (account?.provider === 'google') {
            try {
                await connectToDatabase();
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
        }
        return true; 
    },
    async jwt({ token, user, account, profile }) {
      if (user) { 
        // user object is available only on sign in
        token.userId = user.userId || (user as any)._id.toString(); // Map _id to userId for credentials provider
        token.email = user.email;
        token.name = user.name;
        token.picture = user.picture;
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
