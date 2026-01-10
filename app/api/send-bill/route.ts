import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import Order from "@/models/Order";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { connectToDatabase } from "@/lib/dbConnect";

// connect to MongoDB
// Connection handled inside handler

async function generatePDFBill(user: any, orders: any[], transactionId: string, orderIds: string[]) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { height, width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = height - 60;

  // --- HEADER ---
  page.drawText("SpecsVue", {
    x: 50,
    y,
    size: 22,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.6),
  });
  page.drawText("GSTIN: 29ABCDE1234F1Z5", { x: 400, y, size: 10, font });
  y -= 15;
  page.drawText("Email: specsvue@gmail.com | Phone: +91 8630111264", {
    x: 50,
    y,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 15;
  page.drawText(
    "Plot no. 1 Krishna Vihar, BSA Engineering College Rd, near Old Police Chowki, Avas Vikas Colony, Mathura, Uttar Pradesh 281004",
    { x: 50, y, size: 9, font, color: rgb(0.3, 0.3, 0.3) }
  );

  // Blue line separator
  y -= 20;
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 2,
    color: rgb(0.1, 0.2, 0.6),
  });

  // --- TITLE ---
  y -= 40;
  page.drawText("TAX INVOICE", {
    x: 240,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // --- CUSTOMER DETAILS ---
  y -= 40;
  page.drawText("Customer Details", { x: 50, y, size: 14, font: boldFont });
  y -= 20;
  page.drawText(`Name: ${user.name}`, { x: 50, y, size: 12, font });
  y -= 15;
  page.drawText(`Email: ${user.email}`, { x: 50, y, size: 12, font });
  y -= 15;
  page.drawText(`Transaction ID: ${transactionId}`, { x: 50, y, size: 12, font });
  y -= 15;
  page.drawText(`Order IDs: ${orderIds.join(", ")}`, { x: 50, y, size: 12, font, color: rgb(0.3, 0.3, 0.3) });

  // Line separator
  y -= 25;
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // --- ORDER DETAILS (HORIZONTAL STYLE) ---
  y -= 30;
  page.drawText("Order Details", { x: 50, y, size: 14, font: boldFont });
  y -= 25;

  const joinValues = (key: string) =>
    orders.map((o) => o[key] || o.frameDetails?.[key] || "N/A").join(" | ");

  const drawRow = (label: string, value: string) => {
    page.drawText(`${label}:`, { x: 50, y, size: 12, font: boldFont });
    page.drawText(value, { x: 150, y, size: 12, font });
    y -= 18;
  };

  drawRow("Product", orders.map((o) => o.frameDetails?.brandName || "N/A").join(" | "));
  drawRow("Model", orders.map((o) => o.frameDetails?.modelNumber || "N/A").join(" | "));
  drawRow("Qty", orders.map((o) => o.quantity).join(" | "));
  drawRow("Price ()", orders.map((o) => o.price).join(" | "));
  drawRow("Subtotal ()", orders.map((o) => o.subtotal).join(" | "));
  drawRow("Tax ()", orders.map((o) => o.tax).join(" | "));
  drawRow("Discount ()", orders.map((o) => o.discount).join(" | "));
  drawRow("Total ()", orders.map((o) => o.totalAmount).join(" | "));

  const grandTotal = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  // --- TOTAL SECTION ---
  y -= 20;
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.6, 0.6, 0.6),
  });

  y -= 30;
  page.drawText(`Grand Total: ${grandTotal.toFixed(2)}`, {
    x: 400,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0, 0.4, 0.1),
  });

  // --- FOOTER ---
  y -= 60;
  page.drawText("Thank you for shopping with SpecsVue!", {
    x: 180,
    y,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 15;
  page.drawText("This is a computer-generated invoice and does not require a signature.", {
    x: 100,
    y,
    size: 9,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { transactionId, orderIds } = await req.json();

    // Fetch orders
    const orders = await Order.find({ orderId: { $in: orderIds } });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: "No orders found" }, { status: 404 });
    }

    // Generate PDF
    const pdfBuffer = await generatePDFBill(session.user, orders, transactionId, orderIds);

    // Email config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: session.user.email as string,
      subject: "Your Order Invoice - SpecsVue",
      text: `Dear ${session.user.name},\n\nPlease find attached your invoice for Transaction ID: ${transactionId}.\n\nThank you for shopping with SpecsVue!\n\nWarm regards,\nSpecsVue`,
      attachments: [
        {
          filename: `Invoice_${transactionId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ message: "Bill has been sent successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("Error generating bill:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
