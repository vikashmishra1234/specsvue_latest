import { connectToDatabase } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { signToken } from "@/actions/jwt";
import Admin from "@/models/Admin";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // Parse JSON body safely
    const body = await req.json();
    const { adminId, password } = body;

    if (!adminId || !password) {
      return NextResponse.json({ error: "adminId and password are required" }, { status: 400 });
    }

    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = admin.password === password;

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: admin._id, adminId: admin.adminId });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
