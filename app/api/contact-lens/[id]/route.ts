import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import { ContactLens } from "@/models/ContactLens";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const product = await ContactLens.findById(params.id);
    if (!product) return NextResponse.json({ message: "Not Found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
