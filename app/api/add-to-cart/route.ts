import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const cartData = await req.json();

    const {
      lensId,
      userId,
      productId,
      lensName,
      lensCoating,
      lensMaterial,
      price,
    } = cartData;

    if (
      !userId ||
      !productId ||
      !lensName ||
      !lensCoating ||
      !lensMaterial ||
      !price ||
      !lensId
    ) {
      return NextResponse.json(
        { error: "Missing fields in cart data" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId });

    const priceAsNumber = typeof price === "string" ? parseFloat(price) : price;

    const newItem = {
      lensId,
      productId: new mongoose.Types.ObjectId(productId),
      lensName,
      lensCoating,
      lensMaterial,
      quantity: 1,
      price: priceAsNumber,
    };

    if (!cart) {
      cart = new Cart({
        userId,
        cartTotal: priceAsNumber,
        items: [newItem],
      });
    } else {
      const existingItem = cart.items.find(
        (item: any) =>
          item.lensId === lensId &&
          item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push(newItem);
      }

      cart.cartTotal = Number(cart.cartTotal || 0) + priceAsNumber;
    }

    await cart.save();

    return NextResponse.json(
      { message: "Added to cart successfully", cart },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while adding to cart:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
