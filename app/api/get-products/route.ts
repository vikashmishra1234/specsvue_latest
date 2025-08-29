import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

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
    if(productCategory==="all"){ 
      const products = await Product.find({}).limit(limit);
      return NextResponse.json({ products }, { status: 200 });
    }
    else{
      const products = await Product.find({productType:{$regex:productCategory,$options:"i"}}).limit(limit);
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
