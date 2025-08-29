"use server"
import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";

export default async function getAllUsers() {
  try {
    await connectToDatabase();

    const orders = await User.find({})

    return {
      success: true,
      data: JSON.parse(JSON.stringify(orders)), // ensures serializable data
      message: "Users found successfully",
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      message: "Database error",
    };
  }
}
