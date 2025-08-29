// types/next-auth.d.ts (or wherever you prefer)
import NextAuth from "next-auth";
declare module "next-auth"{
    interface Profile{
        email_verified:boolean;
        picture:string;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
    id: string;
    accessToken?: string;
}
}


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userId?:string|null;
      picture:string;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    userId:string;
    picture:string;
  }
}