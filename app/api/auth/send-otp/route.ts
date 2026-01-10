import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import User from '@/models/User';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        userId: email, // Use email as userId for now
        email,
        name: name || undefined, // Save name if provided
        otp,
        otpExpiry,
        isVerified: false,
      });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      if (name) user.name = name; // Update name if provided later
    }

    await user.save();

    // Send Email
    // If environment variables are not set, we just log it (dev mode)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[DEV MODE] OTP for ${email} is ${otp}`);
        return NextResponse.json({ message: 'OTP sent (dev mode logged)' });
    }

    const emailSent = await sendEmail(
      email,
      'Your Login OTP',
      `<p>Your OTP for login is <b>${otp}</b>. It expires in 10 minutes.</p>`
    );

    if (emailSent) {
      return NextResponse.json({ message: 'OTP sent successfully' });
    } else {
      return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
