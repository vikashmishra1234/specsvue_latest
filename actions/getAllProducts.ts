"use server"
import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product";

export default async function getAllProducts() {
  try {
    await connectToDatabase();

    const orders = await Product.find({})

    return {
      success: true,
      data: JSON.parse(JSON.stringify(orders)), // ensures serializable data
      message: "Products found successfully",
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: "Database error",
    };
  }
}
