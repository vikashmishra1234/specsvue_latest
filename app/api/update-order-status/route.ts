import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
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

    // 🟡 Handle Request for Cancellation
    if (orderStatus === "Requested Cancellation") {
      order.orderStatus = "Requested Cancellation";
      order.statusHistory.push({
        status: "Requested Cancellation",
        updatedAt: new Date(),
      });
      await order.save();

      // 📩 Send email to Admin
      const adminMail = {
        from: `"Specsvue Alerts" <${process.env.EMAIL_USER}>`,
        to: "vikashmishra8371@gmail.com", // Admin email
        subject: `Order Cancellation Request - ${order.orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 10px; border: 1px solid #ddd;">
            <h2>Cancellation Request Received</h2>
            <p><b>Customer:</b> ${session?.user?.name || "Unknown User"} (${session?.user?.email || "N/A"})</p>
            <p><b>Order ID:</b> ${order.orderId}</p>
            <p><b>Product:</b> ${order.frameDetails?.brandName || "N/A"} (${order.frameDetails?.modelNumber || "N/A"})</p>
            <p><b>Reason:</b> User has requested order cancellation.</p>
            <hr/>
            <small>Specsvue Admin Notification © ${new Date().getFullYear()}</small>
          </div>
        `,
      };

      await transporter.sendMail(adminMail);

      // 📩 Send confirmation to user
      const userMail = {
        from: `"Specsvue" <${process.env.EMAIL_USER}>`,
        to: session?.user?.email as string,
        subject: `Order #${order.orderId} Cancellation Request Received`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 10px; border: 1px solid #ddd;">
            <h2>Hello ${session?.user?.name || "Customer"},</h2>
            <p>We’ve received your cancellation request for order <b>${order.orderId}</b>.</p>
            <p>Our team will review your request and update the status shortly.</p>
            <p>Thank you for your patience!</p>
            <hr/>
            <small>Specsvue © ${new Date().getFullYear()}</small>
          </div>
        `,
      };

      await transporter.sendMail(userMail);

      return NextResponse.json(
        { success: true, data: order, message: "Cancellation request recorded and emails sent." },
        { status: 200 }
      );
    }

    // 🔴 Handle Final Cancellation (Confirmed by Admin)
    if (orderStatus === "cancelled") {
      const frameId = order.frameDetails?._id || order.productId;
      if (frameId) {
        const product = await Product.findById(frameId);
        console.log(product)
        if (product) {
          const currentStock = Number(product.stock) || 0;
          const cancelQty = Number(order.quantity) || 1;
          product.stock = (currentStock + cancelQty).toString();
          await product.save();
        }
      }

      order.orderStatus = "cancelled";
      order.statusHistory.push({
        status: "cancelled",
        updatedAt: new Date(),
      });
      await order.save();
    }

    // 🟢 For other statuses (delivered, shipped, etc.)
    else {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        updatedAt: new Date(),
      });
      await order.save();
    }

    // ✉️ Send email to user for update
    // const userMail = {
    //   from: `"Specsvue" <${process.env.EMAIL_USER}>`,
    //   to: session?.user?.email as string,
    //   subject: `Your Order #${order.orderId} Status Update`,
    //   html: `
    //     <div style="font-family: Arial, sans-serif; padding: 10px; border: 1px solid #ddd;">
    //       <h2>Hello ${session?.user?.name || "Customer"},</h2>
    //       <p>Your order <b>${order.orderId}</b> has been updated.</p>
    //       <p><b>New Status:</b> ${order.orderStatus}</p>
    //       <p>Thank you for shopping with Specsvue!</p>
    //       <hr/>
    //       <small>Specsvue © ${new Date().getFullYear()}</small>
    //     </div>
    //   `,
    // };

    // await transporter.sendMail(userMail);

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
