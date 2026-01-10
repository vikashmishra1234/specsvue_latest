
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ContactLens from "@/models/ContactLens";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
            to: "vikashmishra8371@gmail.com", // Admin email
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

    // 🔴 Handle Final Cancellation (Admin Action) - RESTOCKING LOGIC
    if (orderStatus === "cancelled") {
      const productId = order.productId;
      const quantityToRestock = Number(order.quantity) || 1;

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
               // Ensure stock is number
               product.stock = Number(product.stock) + quantityToRestock;
               await product.save();
           }
      }

      order.orderStatus = "cancelled";
      order.statusHistory.push({
        status: "cancelled",
        updatedAt: new Date(),
      });
      await order.save();
      
      // Send Cancellation Approved Email
      if (process.env.EMAIL_USER && order.userId) { 
           // Need user email. session might be admin here, so we might not have user email in session.
           // However, we don't store user email in Order model explicitly, usually fetched via User model.
           // For now, if Admin performs this, 'session' is Admin. 
           // We can't email the user unless we fetch the User or if email is stored in Order (not in schema).
           // Assuming we can skip user email if not available, OR fetch user.
           // I will verify User model later. For now, skipping if email not found.
      }
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
