import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import mongoose from "mongoose";
import Product from "@/models/Product";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const cartData = await req.json();

    const {
      productType = 'Frame', // Default to Frame if not specified
      // Common
      userId,
      productId,
      cartProductId,
      price,
      quantity = 1,
      
      // Frame specific
      lensId,
      lensName,
      lensCoating,
      lensMaterial,
      
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

    // Validation based on Type
    if (productType === 'Frame') {
        if (!lensName || !lensCoating || !lensMaterial || !lensId) {
             return NextResponse.json({ error: "Missing Frame lens details" }, { status: 400 });
        }
    }
    // Contact Lens validation if needed (e.g. power)

    await Product.find({}) // Keep or remove if unused, seemingly unused in original code
    let cart = await Cart.findOne({ userId });

    const priceAsNumber = typeof price === "string" ? parseFloat(price) : price;

    let newItem: any = {
      productType,
      productId: productId, // Storing as String based on updated model (or ObjectId if Frame) - keeping as passed
      cartProductId,
      quantity: quantity,
      price: priceAsNumber,
    };

    if (productType === 'Frame') {
        newItem = {
            ...newItem,
            lensId,
            lensName,
            lensCoating,
            lensMaterial,
            productId: new mongoose.Types.ObjectId(productId), // Frames use ObjectId ref
        }
    } else {
        newItem = {
            ...newItem,
            power,
            cylinder,
            axis,
            baseCurve,
            diameter,
            color
        }
    }

    if (!cart) {
      cart = new Cart({
        userId,
        cartTotal: priceAsNumber * quantity,
        items: [newItem],
      });
    } else {
       // Check for existing item
       // match criteria depends on type
       let existingItem;
       if(productType === 'Frame') {
          existingItem = cart.items.find((item: any) => 
               item.productType === 'Frame' && 
               item.lensId === lensId && 
               item.cartProductId === cartProductId
          );
       } else {
          // For contact lens, match options
          existingItem = cart.items.find((item: any) => 
             item.productType === 'ContactLens' &&
             item.productId === productId &&
             item.power === power &&
             item.cylinder === cylinder &&
             item.axis === axis &&
             item.color === color
             // Add others if strictly separating
          );
       }

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push(newItem);
      }

      cart.cartTotal = Number(cart.cartTotal || 0) + (priceAsNumber * quantity);


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
