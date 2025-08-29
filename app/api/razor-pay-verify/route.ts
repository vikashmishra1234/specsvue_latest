import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Payment from '@/models/Payment';
import { connectToDatabase } from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      userId,
    } = body;

    // 🔐 Basic validation
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !amount ||
      !userId
    ) {
      return NextResponse.json(
        { error: 'Missing required payment data.' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('❌ Missing RAZORPAY_KEY_SECRET env variable');
      return NextResponse.json(
        { error: 'Server misconfiguration' },
        { status: 500 }
      );
    }

    // 🔒 Signature verification
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const verified = expectedSignature === razorpay_signature;

    if (!verified) {
      return NextResponse.json(
        { verified: false, error: 'Signature verification failed' },
        { status: 400 }
      );
    }

    // ✅ Save to DB
    await connectToDatabase();

    await Payment.create({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      amount,
      currency: 'INR',
      status: 'success',
      userId,
    });

    return NextResponse.json({ verified: true }, { status: 200 });
  } catch (error: any) {
    console.error('💥 Payment Verification Error:', error);
    return NextResponse.json(
      { verified: false, error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
