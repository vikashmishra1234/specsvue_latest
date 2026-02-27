import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export const revalidate = 300;
const CACHE_HEADERS = {
  "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
};

export async function GET() {
  try {
    await connectToDatabase();
    const [
      categories,
      genders,
      frameShape,
      frameSize,
      prescriptionType,
      weight,
      frameColor,
      frameMaterial,
    ] = await Promise.all([
      Product.distinct("productType"),
      Product.distinct("gender"),
      Product.distinct("frameShape"),
      Product.distinct("frameSize"),
      Product.distinct("prescriptionType"),
      Product.distinct("weight"),
      Product.distinct("frameColor"),
      Product.distinct("frameMaterial"),
    ]);



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
    }, { status: 200, headers: CACHE_HEADERS });
    
  } catch (error) {
    console.log("Error While Fetching Filters:", error);
    return NextResponse.json({
      error: "Error While Fetching Filters"
    }, { status: 500 });
  }
}
