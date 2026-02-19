import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") as any;
    const productCategory = url.searchParams.get("category") as string;
    
    if (!limit || !productCategory) {
     return NextResponse.json(
        {
          message: "Limit is not defined",
        },
        {
          status: 500,
        }
      );
    }
    const parsedLimit = Number(limit);
    const safeLimit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 60) : 12;
    const listFields =
      "_id images frameMaterial frameSize brandName price discount stock productType frameShape frameColor gender weight prescriptionType";

    if(productCategory==="all"){ 
      const products = await Product.find({})
        .sort({ createdAt: -1 })
        .limit(safeLimit)
        .select(listFields)
        .lean();
      return NextResponse.json({ products }, { status: 200 });
    }
    else{
      const products = await Product.find({productType:{$regex:productCategory,$options:"i"}})
        .sort({ createdAt: -1 })
        .limit(safeLimit)
        .select(listFields)
        .lean();
      return NextResponse.json({ products }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
