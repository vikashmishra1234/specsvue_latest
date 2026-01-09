"use server"
import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import ContactLens from "@/models/ContactLens";
import mongoose from "mongoose";

export default async function getUserCart(userId: string) {
  if (!userId) {
    return {
      success: false,
      message: "Please provide a user ID.",
    };
  }

  try {
    await connectToDatabase();
    // Force schemas to register if not already
    await Product.init();
    await ContactLens.init();
    
    // We don't populate here because we need to handle mixed types
    let currentUserCart = await Cart.findOne({ userId }).lean();

    if (!currentUserCart) {
      return {
        success: false,
        message: "No cart found for this user.",
        data: null,
      };
    }

    // Manually populate items
    const populatedItems = await Promise.all(currentUserCart.items.map(async (item: any) => {
        if (item.productType === 'ContactLens') {
            const lensDetails = await ContactLens.findById(item.productId).lean();
            return { ...item, productId: lensDetails || item.productId }; // Replace ID with object
        } else {
             // Default to Frame/Product
             const productDetails = await Product.findById(item.productId).lean();
             return { ...item, productId: productDetails || item.productId, productType: 'Frame' };
        }
    }));

    currentUserCart.items = populatedItems;

    return {
      success: true,
      message: "Cart fetched successfully.",
      data: JSON.parse(JSON.stringify(currentUserCart)),
    };
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return {
      success: false,
      message: "An error occurred while fetching the cart.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
