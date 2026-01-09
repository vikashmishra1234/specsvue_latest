import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const cartData = await req.json();

    const {
      userId,
      productId,
      cartProductId,
      price,
      quantity = 1,
      
      // Contact Lens specific
      power,
      cylinder,
      axis,
      baseCurve,
      diameter,
      color
    } = cartData;

    if (!userId || !productId || !price || !cartProductId) {
      return NextResponse.json(
        { error: "Missing required common fields (userId, productId, price, cartProductId)" },
        { status: 400 }
      );
    }
    
    // Explicit validation for Contact Lens fields if needed
    // e.g. if power is mandatory

    let cart = await Cart.findOne({ userId });

    const priceAsNumber = typeof price === "string" ? parseFloat(price) : price;

    let newItem = {
      productType: 'ContactLens',
      productId: productId,
      cartProductId,
      quantity: quantity,
      price: priceAsNumber,
      power,
      cylinder,
      axis,
      baseCurve,
      diameter,
      color
    };

    if (!cart) {
      cart = new Cart({
        userId,
        cartTotal: priceAsNumber * quantity,
        items: [newItem],
      });
    } else {
       // Check for existing item
       const existingItem = cart.items.find((item: any) => 
             item.productType === 'ContactLens' &&
             item.productId === productId &&
             item.power === power &&
             item.cylinder === cylinder &&
             item.axis === axis &&
             item.color === color
          );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push(newItem);
      }

      cart.cartTotal = Number(cart.cartTotal || 0) + (priceAsNumber * quantity);
    }

    await cart.save();

    return NextResponse.json(
      { message: "Contact Lens added to cart successfully", cart },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error while adding contact lens to cart:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
