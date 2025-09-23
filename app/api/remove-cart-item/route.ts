import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { userId, cartProductId, lensId } = await req.json();

    if (!userId || !cartProductId || !lensId) {
      return NextResponse.json(
        { message: "Missing userId, cartProductId, or lensId" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const itemsToRemove = cart.items.filter(
  (item: any) => item.cartProductId === cartProductId && item.lensId === lensId
);

if (itemsToRemove.length === 0) {
  return NextResponse.json(
    { message: "Item not found in the cart" },
    { status: 404 }
  );
}

// Calculate how much to subtract
const removeAmount = itemsToRemove.reduce(
  (sum: number, item: any) => sum + (item.price * (item.quantity || 1)),
  0
);

const updatedTotal = cart.cartTotal - removeAmount;

// Keep only the remaining items
const newCartItems = cart.items.filter(
  (item: any) => !(item.cartProductId === cartProductId && item.lensId === lensId)
);

await Cart.findOneAndUpdate(
  { userId },
  { $set: { cartTotal: updatedTotal, items: newCartItems } }
);

    return NextResponse.json(
      { message: "Product is removed from the cart" },
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
