import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Product.distinct("productType");
    const genders = await Product.distinct("gender");
    const frameShape = await Product.distinct("frameShape");
    const frameSize = await Product.distinct("frameSize");
    const prescriptionType = await Product.distinct("prescriptionType");
    const weight = await Product.distinct("weight");
    const frameColor = await Product.distinct("frameColor");
    const frameMaterial = await Product.distinct("frameMaterial");



    return NextResponse.json({
      filters: {
        categories,
        genders,
        frameShape,
        frameSize,
        prescriptionType,
        weight,
        frameColor,
        frameMaterial
      }
    }, { status: 200 });
    
  } catch (error) {
    console.log("Error While Fetching Filters:", error);
    return NextResponse.json({
      error: "Error While Fetching Filters"
    }, { status: 500 });
  }
}
