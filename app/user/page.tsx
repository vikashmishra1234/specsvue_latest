import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import UnifiedDashboard from "@/app/user/UnifiedDashboard";
import { redirect } from "next/navigation";

export default async function UserOverviewPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.userId) {
      redirect("/login"); 
  }
  
  await connectToDatabase();

  const userId = session.user.userId;
  const userEmail = session.user.email;

  // 1. Fetch User
  // Try finding by userId first, then email
  let userDoc = await User.findOne({ userId }).lean();
  if (!userDoc && userEmail) {
      userDoc = await User.findOne({ email: userEmail }).lean();
  }
  
  const user = JSON.parse(JSON.stringify(userDoc || {
      name: session.user.name,
      email: session.user.email,
      picture: session.user.image,
  }));

  // 2. Fetch ALL Orders (Active + Cancelled)
  // We fetch everything here so the client can filter instantly
  const ordersDoc = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
  const orders = JSON.parse(JSON.stringify(ordersDoc));

  return (
    <UnifiedDashboard 
        user={user} 
        userId={userId} 
        orders={orders} 
    />
  );
}
