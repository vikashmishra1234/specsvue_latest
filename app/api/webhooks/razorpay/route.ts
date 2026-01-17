
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not defined");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { message: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(body);
    const event = payload.event;
    const entity = payload.payload.payment?.entity || payload.payload.refund?.entity;

    if (!entity) {
        return NextResponse.json({ message: "No entity found" }, { status: 200 });
    }

    await connectToDatabase();

    // Find order by refundId (preferred) or orderId/paymentId
    // The refund entity has 'order_id' (Razorpay Order ID), but our DB stores our orderId and transactionId
    // Best match: using the refund ID if we stored it, or the payment ID.
    
    // Strategy:
    // 1. If event is 'refund.*', entity.id is refund_id. Match order.refundId
    // 2. If 'payment.refunded', entity.id is payment_id. Match order.razorpay_payment_id
    
    let order;
    
    if (event === 'refund.processed' || event === 'refund.failed') {
        const refundId = payload.payload.refund.entity.id;
        order = await Order.findOne({ refundId: refundId });
        
        // Fallback: search by notes if orderId is embedded there
        if (!order && payload.payload.refund.entity.notes?.orderId) {
             order = await Order.findOne({ orderId: payload.payload.refund.entity.notes.orderId });
        }
    } else if (event === 'payment.refunded') {
         // This event entity is 'payment', but it might contain refund details or just payment details.
         // Usually we rely on refund events for granular status. 
         // But user asked to subscribe to this too.
         // If payment.refunded triggers, the refund is done.
         // We can match by payment ID.
         const paymentId = payload.payload.payment.entity.id;
         order = await Order.findOne({ razorpay_payment_id: paymentId });
    }

    if (!order) {
        console.warn(`Webhook: Order not found for event ${event}`, entity.id);
         return NextResponse.json({ message: "Order not found" }, { status: 200 }); // Return 200 to acknowledge webhook
    }

    let statusUpdated = false;

    if (event === "refund.processed" || event === "payment.refunded") {
      if (order.refundStatus !== 'processed') {
          order.refundStatus = "processed";
          order.statusHistory.push({
            status: "refund_processed",
            updatedAt: new Date(),
            comment: `Webhook: Refund Processed via ${event}`
          });
          statusUpdated = true;
      }
    } else if (event === "refund.failed") {
         if (order.refundStatus !== 'failed') {
            order.refundStatus = "failed";
            order.statusHistory.push({
                status: "refund_failed",
                updatedAt: new Date(),
                comment: `Webhook: Refund Failed via ${event}`
            });
            statusUpdated = true;
         }
    }

    if (statusUpdated) {
        await order.save();
        console.log(`Webhook: Updated Order ${order.orderId} refund status to ${order.refundStatus}`);
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
