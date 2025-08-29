// app/api/get-cart/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product"; // Import Product first
import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Ensure DB connection is established first
    await connectToDatabase();
    
    // Force Mongoose to recognize both models in the right order
    const ProductModel = Product;
    const CartModel = Cart;
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json(
        { message: "Please provide the user ID" },
        { status: 400 }
      );
    }
    
    // Get the cart for the user and populate product info inside items
    const cart = await CartModel.findOne({ userId }).populate("items.productId");
    
    if (!cart) {
      return NextResponse.json(
        { cartProducts: [] },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { cartProducts: cart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart products:", error);
    return NextResponse.json(
      { message: "Failed to fetch cart products" },
      { status: 500 }
    );
  }
}