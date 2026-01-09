
import { NextResponse } from "next/server";
import ContactLens from "@/models/ContactLens";
import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const lens = await ContactLens.findById(id);

    if (!lens) {
      return NextResponse.json({ success: false, error: "Contact Lens not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: lens });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
