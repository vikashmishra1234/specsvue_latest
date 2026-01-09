
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
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type"); // Daily, Monthly
    const brand = searchParams.get("brand");

    const query: any = {};
    if (type) query.lensType = type;
    if (brand) query.brandName = brand;

    const lenses = await ContactLens.find(query).limit(limit).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products: lenses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
