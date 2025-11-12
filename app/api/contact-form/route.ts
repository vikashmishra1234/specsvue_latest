import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, phone, subject, message } = await req.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your admin email
        pass: process.env.EMAIL_PASS,
      },
    });

    // Compose email content
    const mailOptions = {
      from: `"SpecsVue Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // admin email here
      subject: `New Contact Form Message - ${subject}`,
      text: `
You have received a new message from SpecsVue Contact Form:

Name: ${firstName} ${lastName}
Phone: ${phone}

Subject: ${subject}

Message:
${message}
      `,
    };

    // Send email to admin
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "We have recieved your message" }, { status: 200 });
  } catch (error: any) {
    console.error("Error sending contact form email:", error);
    return NextResponse.json(
      { message: "Failed to send message", error: error.message },
      { status: 500 }
    );
  }
}
