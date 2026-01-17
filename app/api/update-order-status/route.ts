
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ContactLens from "@/models/ContactLens";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { orderId, orderStatus } = await req.json();

    if (!orderId || !orderStatus) {
      return NextResponse.json(
        { success: false, message: "Please provide both orderId and orderStatus." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findOne({_id:orderId});
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }
    
    // Prevent cancellation if delivered
    if (orderStatus === "Requested Cancellation" && order.orderStatus === "delivered") {
         return NextResponse.json(
            { success: false, message: "Cannot cancel a delivered order." },
            { status: 400 }
         );
    }


    // 📨 Setup Email Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Helper to get product name
    const orderProductName = order.productType === 'ContactLens' 
        ? `${order.contactLensDetails?.name} (${order.contactLensDetails?.lensType})`
        : `${order.frameDetails?.brandName} ${order.frameDetails?.modelNumber}`;

    // 🟡 Handle Request for Cancellation (User Action)
    if (orderStatus === "Requested Cancellation") {
      order.orderStatus = "Requested Cancellation";
      order.statusHistory.push({
        status: "Requested Cancellation",
        updatedAt: new Date(),
      });
      await order.save();

      // 📩 Send email to Admin
      if (process.env.EMAIL_USER) {
          const adminMail = {
            from: `"Specsvue Alerts" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || "vikashmishra8371@gmail.com", // Admin email
            subject: `Order Cancellation Request - ${order.orderId}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
                <h2 style="color: #d9534f;">Cancellation Request Received</h2>
                <p><b>Customer:</b> ${session?.user?.name || "Unknown"} (${session?.user?.email || "Unknown"})</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <p><b>Order ID:</b> ${order.orderId}</p>
                    <p><b>Product:</b> ${orderProductName}</p>
                    <p><b>Amount:</b> ₹${order.totalAmount}</p>
                </div>
                <p>Please review this request in the admin dashboard.</p>
                <a href="${process.env.NEXTAUTH_URL}/admin/dashboard" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
                <hr/>
                <small>Specsvue Admin Notification © ${new Date().getFullYear()}</small>
              </div>
            `,
          };
          await transporter.sendMail(adminMail);

          // 📩 Send confirmation to user
          const userMail = {
            from: `"Specsvue Support" <${process.env.EMAIL_USER}>`,
            to: session?.user?.email as string,
            subject: `Cancellation Request Received - Order #${order.orderId}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333;">Request Received</h2>
                <p>Hello ${session?.user?.name || "Customer"},</p>
                <p>We have successfully received your cancellation request for Order <b>${order.orderId}</b>.</p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><b>Product:</b> ${orderProductName}</p>
                    <p style="margin: 5px 0;"><b>Current Status:</b> Requested Cancellation</p>
                </div>
                <p>Our team will process this shortly and you will be notified once the cancellation is approved.</p>
                <p>If you have any questions, simply reply to this email.</p>
                <br/>
                <p>Best Regards,<br/>Team Specsvue</p>
              </div>
            `,
          };
          await transporter.sendMail(userMail);
      }

      return NextResponse.json(
        { success: true, data: order, message: "Cancellation request submitted." },
        { status: 200 }
      );
    }

    // 🔴 Handle Final Cancellation (Admin Action) - RESTOCKING & REFUND LOGIC
    if (orderStatus === "cancelled") {
      const productId = order.productId;
      const quantityToRestock = Number(order.quantity) || 1;

      // 1. Restock Logic
      if (order.productType === 'ContactLens') {
           const lens = await ContactLens.findById(productId);
           if (lens) {
               lens.stock = Number(lens.stock) + quantityToRestock;
               await lens.save();
           }
      } else {
           // Frame
           const product = await Product.findById(productId);
           if (product) {
               product.stock = Number(product.stock) + quantityToRestock;
               await product.save();
           }
      }

      // 2. 💸 Automatic Refund Logic
      let refundMessage = "";
      if (
          order.paymentMethod === 'razorpay' && 
          order.paymentStatus === 'paid' && 
          order.razorpay_payment_id
      ) {
          try {
             // Init Razorpay
             const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID!,
                key_secret: process.env.RAZORPAY_KEY_SECRET!,
             });

             console.log(`Attempting refund for Order: ${order.orderId}, PaymentID: ${order.razorpay_payment_id}`);
             
             const refund = await razorpay.payments.refund(order.razorpay_payment_id, {
                 speed: 'normal',
                 notes: {
                     reason: "Admin cancelled order",
                     orderId: order.orderId
                 }
             });

             if (refund && refund.id) {
                 order.refundId = refund.id;
                 order.refundStatus = 'initiated';
                 refundMessage = ". Refund initiated successfully. Please check status shortly.";
                 order.statusHistory.push({
                    status: "refund_initiated",
                    updatedAt: new Date(),
                    comment: `Refund ID: ${refund.id}`
                 });
             }
          } catch (refundError: any) {
              console.error("Refund Failed:", refundError);
              order.refundStatus = 'failed';
              refundMessage = ". WARNING: Automatic refund failed. Please check Razorpay dashboard.";
              // We still cancel the order locally, but log the error
          }
      }

      order.orderStatus = "cancelled";
      order.statusHistory.push({
        status: "cancelled",
        updatedAt: new Date(),
      });
      await order.save();
      
      return NextResponse.json(
        { success: true, data: order, message: `Order cancelled successfully${refundMessage}` },
        { status: 200 }
      );
    }

    // 🟢 For other statuses (delivered, shipped, etc.)
    else {
      order.orderStatus = orderStatus;
      if (orderStatus === 'delivered') {
          order.delivery.deliveredAt = new Date();
          order.paymentStatus = 'paid'; // Ensure paid on delivery
      }
      order.statusHistory.push({
        status: orderStatus,
        updatedAt: new Date(),
      });
      await order.save();
    }

    return NextResponse.json(
      { success: true, data: order, message: "Order status updated successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while updating order." },
      { status: 500 }
    );
  }
}
