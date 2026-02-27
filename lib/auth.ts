import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          user.isVerified = true;
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
                const googleSub = profile?.sub;
                const googleEmail = profile?.email;
                let existingUser = await User.findOne({ userId: googleSub });

                // Handle users who previously signed up with OTP using the same email.
                if (!existingUser && googleEmail) {
                  existingUser = await User.findOne({ email: googleEmail });
                }
                
                if (!existingUser) {
                  const newUser = new User({
                    userId: googleSub,
                    email: googleEmail,
                    name: profile?.name,
                    picture: profile?.picture,
                    isVerified: profile?.email_verified,
                    token: account?.access_token,
                  });
                  await newUser.save();
                } else {
                  existingUser.userId = existingUser.userId || googleSub;
                  existingUser.email = existingUser.email || googleEmail;
                  existingUser.name = profile?.name || existingUser.name;
                  existingUser.picture = profile?.picture || existingUser.picture;
                  existingUser.isVerified = true;
                  existingUser.token = account?.access_token || existingUser.token;
                  await existingUser.save();
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
        token.userId = user.userId || user.email || (user as any)._id.toString();
        token.email = user.email;
        token.name = user.name;
        token.picture = user.picture;
      }
      if (account?.provider === "google" && profile?.email) {
        await connectToDatabase();
        const userDoc = (await User.findOne({ email: profile.email })
          .select("userId")
          .lean()) as { userId?: string } | null;
        if (userDoc?.userId) {
          token.userId = userDoc.userId;
        }
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
