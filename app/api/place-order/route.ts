import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { placeOrder } from "@/lib/services/orderService";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.userId;
    const { addressId, razorpay_payment_id } = await req.json();

    const result = await placeOrder({
      userId,
      addressId,
      razorpay_payment_id,
    });

    return NextResponse.json(
      {
        message: "Orders placed successfully",
        transactionId: result.transactionId,
        ordersCount: result.orders.length,
        orderIds: result.orders.map((o: any) => o.orderId),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Order creation failed:", error);
    const status = error.message === "Cart not found or empty" || error.message === "Address not found" ? 404 : 500;
    return NextResponse.json({ message: error.message || "Server error" }, { status });
  }
}
