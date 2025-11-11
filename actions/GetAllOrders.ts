"use server"
import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";

export default async function getAllOrders() {
  try {
    await connectToDatabase();

    const orders = await Order.find({})

    return {
      success: true,
      data: JSON.parse(JSON.stringify(orders)), // ensures serializable data
      message: "Orders found successfully",
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      message: "Database error",
    };
  }
}
