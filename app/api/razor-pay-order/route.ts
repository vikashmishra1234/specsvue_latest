import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    // Step 1: Check for required env variables
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("❌ Razorpay credentials not set in environment");
      return NextResponse.json(
        { error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // Step 2: Parse and validate incoming request body
    const body = await req.json();
    const { amount } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      console.log("Invalid amount provided.")
      return NextResponse.json(
        { error: "Invalid amount provided." },
        { status: 400 }
      );
    }

    // Step 3: Create Razorpay instance
    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // Step 4: Prepare options
    const options = {
      amount: Math.round(amount * 100), // INR in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    // Step 5: Create the order
    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      console.log("Failed to create order.")
      return NextResponse.json(
        { error: "Failed to create order." },
        { status: 500 }
      );
    }
    console.log("razor-pay-order working fine")
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("💥 Razorpay Error:", error);
    return NextResponse.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
