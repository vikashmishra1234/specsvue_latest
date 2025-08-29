import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { userId, lensId } = await req.json();

    if (!userId || !lensId) {
      return NextResponse.json(
        { message: "Missing userId or lensId" },
        { status: 400 }
      );
    }

    // 1. Fetch the current cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found" },
        { status: 404 }
      );
    }

    // 2. Find the item to remove
    const itemToRemove = cart.items.find((item:any) => item.lensId === lensId);

    if (!itemToRemove) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    const itemTotal = itemToRemove.price * itemToRemove.quantity;
    const updatedTotal = cart.cartTotal - itemTotal;

    // 3. Update the cart: pull item + update total
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      {
        $pull: { items: { lensId } },
        $set: { cartTotal: updatedTotal }
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Item removed", cart: updatedCart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
