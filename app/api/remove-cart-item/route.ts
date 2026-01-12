import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { userId, cartProductId, lensId } = await req.json();

    if (!userId || !cartProductId) {
      return NextResponse.json(
        { message: "Missing userId or cartProductId" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const itemsToRemove = cart.items.filter(
      (item: any) => {
          // If request has lensId, check it. If not, check if item has no lensId.
          // Or simplified: check cartProductId match AND (lensId match OR both undefined/null)
          
          if (item.cartProductId !== cartProductId) return false;
          
          if (lensId) {
              return item.lensId === lensId;
          } else {
              // If no lensId provided in request, we assume we are removing an item that has NO lensId attached (like a frame only).
              // However, if the item HAS a lensId but we didn't send it, we might accidentally remove the wrong thing?
              // Typically frame-only add-to-cart sends NO lensId.
              // So we match items where lensId is falsy.
              return !item.lensId;
          }
      }
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
      (item: any) => {
          if (item.cartProductId !== cartProductId) return true;
          if (lensId) return item.lensId !== lensId;
          return !!item.lensId; // If we are removing items with NO lensId, keep items WITH lensId
      }
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
