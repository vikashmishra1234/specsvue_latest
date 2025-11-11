import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const {oldPassword,newUserName,newPassword,token} = await req.json(); // ✅ Await the JSON body
     if(!token){
        return NextResponse.json({message:"Token not found"})
    }
    if(!oldPassword){
        return NextResponse.json({message:"Please send the old password"},{status:404});
    }

    
    const currentUser = await Admin.findOne({});
    const isMatch = await bcrypt.compare(oldPassword,currentUser.password);
    if(!isMatch){
        return NextResponse.json({message:'Old Password is incorrect'},{status:409})
    }
    if(newUserName){
        currentUser.adminId = newUserName;
    }
    if(newPassword){
        const newHashPass = await bcrypt.hash(newPassword,10);
        currentUser.password = newHashPass;
    }
    console.log(currentUser)
    await currentUser.save()


    return NextResponse.json(
      { message: "Your account details have been updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating account details:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
