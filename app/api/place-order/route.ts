// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Address from "@/models/Address";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
 try {
   const session = await getServerSession(authOptions);
 
   if (!session || !session.user?.userId) {
     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
   }
 
   const userId = session.user.userId;
   const { addressId,razorpay_payment_id } = await req.json();
 
   await connectToDatabase();
 
   const userCart = await Cart.findOne({ userId }).populate("items.productId");
   if (!userCart) {
     return NextResponse.json({ message: "Cart not found" }, { status: 404 });
   }
 
   const addressDoc = await Address.findOne({ userId });
   const selectedAddress = addressDoc?.addresses?.find(
     (addr: any) => addr._id.toString() === addressId
   );
 
   if (!selectedAddress) {
     return NextResponse.json({ message: "Address not found" }, { status: 404 });
   }
 
   const order = await Order.create({
     userId,
     address: selectedAddress,
     items: userCart.items.map((item: any) => ({
         productId: item.productId._id,
         lensName: item.lensName,
         lensCoating: item.lensCoating,
         lensMaterial: item.lensMaterial,
         quantity: item.quantity || 1,
     })),
     totalAmount: userCart.cartTotal,
     razorpay_payment_id,
     paymentStatus: razorpay_payment_id?"paid":"pending",
     orderStatus: "processing",
   });
   await Cart.findOneAndDelete({userId})
   return NextResponse.json({ message: "Order placed", orderId: order._id }, { status: 200 });
 } catch (error) {
    console.log(error)
    return NextResponse.json({message:"Server error"},{status:500})
 }
}
