import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Payment from '@/models/Payment';
import { connectToDatabase } from '@/lib/dbConnect';
import { placeOrder } from '@/lib/services/orderService';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  // Initialize Razorpay instance inside handler to catch config errors safely
  let razorpay;
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ [Verify API] Missing Razorpay environment variables");
      return NextResponse.json(
        { error: "Server configuration error (Missing Credentials)" },
        { status: 500 }
       );
    }
    
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (initError: any) {
    console.error("❌ [Verify API] Failed to initialize Razorpay:", initError);
    return NextResponse.json(
      { error: "Server configuration error (Initialization Failed)" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    console.log("🔍 [Verify API] Received body:", JSON.stringify({ ...body, razorpay_signature: '***' }));

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      userId,
      addressId 
    } = body;

    // 🔐 Basic validation
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !amount ||
      !userId || 
      !addressId
    ) {
      console.error("❌ [Verify API] Missing required fields:", { 
          razorpay_order_id: !!razorpay_order_id, 
          razorpay_payment_id: !!razorpay_payment_id, 
          razorpay_signature: !!razorpay_signature, 
          amount: !!amount, 
          userId: !!userId, 
          addressId: !!addressId 
      });
      return NextResponse.json(
        { error: 'Missing required payment data.' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('❌ [Verify API] Missing RAZORPAY_KEY_SECRET env variable');
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

    console.log(`🔐 [Verify API] Verifying signature. Expected: ${expectedSignature.substring(0, 5)}... Received: ${razorpay_signature.substring(0, 5)}...`);

    const verified = expectedSignature === razorpay_signature;

    if (!verified) {
      console.error("❌ [Verify API] Signature verification FAILED.");
      return NextResponse.json(
        { verified: false, error: 'Signature verification failed' },
        { status: 400 }
      );
    }

    console.log("✅ [Verify API] Signature verified. Connecting to DB...");

    // ✅ Save Payment Info to DB
    await connectToDatabase();
    
    console.log("✅ [Verify API] DB Connected. Saving Payment...");

    await Payment.create({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      amount,
      currency: 'INR',
      status: 'success',
      userId,
    });

    console.log("✅ [Verify API] Payment saved. Placing Order...");

    // 🚀 ATOMIC ORDER PLACEMENT
    // Now that payment is verified and saved, we IMMEDIATELY try to place the order.
    try {
        const orderResult = await placeOrder({
            userId,
            addressId,
            razorpay_payment_id
        });
        
        console.log("✅ [Verify API] Order placed successfully:", orderResult.transactionId);
        
        // Success!
        return NextResponse.json({ 
            verified: true, 
            orderPlaced: true,
            transactionId: orderResult.transactionId 
        }, { status: 200 });

    } catch (orderError: any) {
        console.error("💥 [Verify API] Payment verified but ORDER FAILED:", orderError);

        // ⚠️ CRITICAL: AUTO-REFUND IF ORDER FAILS
        // If we collected money but couldn't place order (e.g. stock issue), we MUST refund.
        try {
            console.log(`[Verify API] Initiating auto-refund for payment: ${razorpay_payment_id}`);
            await razorpay.payments.refund(razorpay_payment_id, {
                speed: 'normal',
                notes: {
                    reason: "Order placement failed after payment",
                    error: orderError.message
                }
            });
            console.log(`[Verify API] Refund initiated successfully for: ${razorpay_payment_id}`);
            
            return NextResponse.json({ 
                verified: true, 
                orderPlaced: false, 
                refundInitiated: true,
                error: `Payment received but order failed: ${orderError.message}. Refund has been initiated.` 
            }, { status: 200 }); // Return 200 so client knows verify worked, but order logic handled it.

        } catch (refundError) {
             console.error("💀 FATAL [Verify API]: refund failed after order failure!", refundError);
             // This is a situation for manual admin intervention.
             return NextResponse.json({ 
                verified: true, 
                orderPlaced: false, 
                refundInitiated: false,
                error: "Payment received, order failed, and auto-refund failed. Please contact support immediately." 
            }, { status: 500 });
        }
    }

  } catch (error: any) {
    console.error('💥 [Verify API] Payment Verification Error:', error);
    return NextResponse.json(
      { verified: false, error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
