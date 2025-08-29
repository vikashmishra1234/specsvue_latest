"use server"
import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export default async function getUserCart(userId: string) {
  if (!userId) {
    return {
      success: false,
      message: "Please provide a user ID.",
    };
  }

  try {
    await connectToDatabase();

    const currentUserCart = await Cart.findOne({ userId }).populate("items.productId");

    if (!currentUserCart) {
      return {
        success: false,
        message: "No cart found for this user.",
        data: null,
      };
    }

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
