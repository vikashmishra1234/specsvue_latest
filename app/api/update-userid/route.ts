import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { guestId, userId } = await req.json();

  try {
    await connectToDatabase();

    const guestCart = await Cart.findOne({ userId: guestId });
    const userCart = await Cart.findOne({ userId: userId });

    if (guestCart && !userCart) {
      // Just transfer the cart to the new user
      await Cart.findOneAndUpdate({ userId: guestId }, { userId: userId });
    } else if (guestCart && userCart) {
      // Merge logic
      const mergedItems = [...userCart.items];

      guestCart.items.forEach((guestItem:any) => {
        const index = mergedItems.findIndex(
          (item) =>
            item.productId.toString() === guestItem.productId.toString() &&
            item.lensId === guestItem.lensId
        );

        if (index >= 0) {
          // If item already exists, increase quantity
          mergedItems[index].quantity += guestItem.quantity;
        } else {
          // If not, add it to the merged list
          mergedItems.push(guestItem);
        }
      });

      const updatedCartTotal = userCart.cartTotal + guestCart.cartTotal;

      // Update user cart
      await Cart.findOneAndUpdate(
        { userId },
        {
          items: mergedItems,
          cartTotal: updatedCartTotal,
        }
      );

      // Delete the guest cart
      await Cart.deleteOne({ userId: guestId });
    }

    return NextResponse.json({ message: "Cart merged or updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Cart merge error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
