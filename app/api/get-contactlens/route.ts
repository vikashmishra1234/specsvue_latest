import { connectToDatabase } from "@/lib/dbConnect";
import { ContactLensCart } from "@/models/ContactLensCart";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }
    console.log(userId)

    // Fetch cart data
    const cart = await ContactLensCart.findOne({ userId }).populate("items.product");


    if (!cart) {
      return NextResponse.json(
        { message: "Cart is empty", cart: [] },
        { status: 200 }
      );
    }

    // Calculate total price
    // const totalPrice = cart.reduce((total, item) => {
    //   return total + Number(item.price || 0);
    // }, 0);

    return NextResponse.json(
      { cart },
      { status: 200 }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
