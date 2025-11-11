// app/api/get-all-orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Optional warm-up (depending on your schema loading strategy)
    await Product.find({});

    const orders = await Order.find({
      userId,
      // orderStatus: { $ne: "cancelled" },
    })

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
