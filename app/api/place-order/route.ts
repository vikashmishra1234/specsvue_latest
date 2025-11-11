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
    const { addressId, razorpay_payment_id } = await req.json();

    await connectToDatabase();

    const userCart = await Cart.findOne({ userId }).populate("items.productId");
    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json({ message: "Cart not found or empty" }, { status: 404 });
    }
    const addressDoc = await Address.findOne({ userId });
    const selectedAddress = addressDoc?.addresses?.find(
      (addr: any) => addr._id.toString() === addressId
    );

    if (!selectedAddress) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    // Generate a single transaction ID for this checkout
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create individual order for each product in cart
    const orders = await Promise.all(
      userCart.items.map(async (item: any) => {
        const product = item.productId;
        if (!product) return null;

        // Update stock safely
        const currentStock = Number(product.stock) || 0;
        const orderQty = Number(item.quantity) || 1;
        product.stock = Math.max(currentStock - orderQty, 0).toString();
        await product.save();

        // Extract frame details snapshot
        
        const frameDetails = {
          brandName: product.brandName,
          productType: product.productType,
          frameType: product.frameType,
          frameShape: product.frameShape,
          modelNumber: product.modelNumber,
          frameColor: product.frameColor,
          frameMaterial: product.frameMaterial,
          templeMaterial: product.templeMaterial,
          prescriptionType: product.prescriptionType,
          frameStyle: product.frameStyle,
          gender: product.gender,
          price: product.price,
          discount: product.discount,
          images: product.images,
        };
        // Calculate totals
        const quantity = item.quantity || 1;
        const price = Number(product.price);
        const subtotal = price * quantity;

        // Create order document
        const order = await Order.create({
          orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          transactionId,
          userId,
          productId: product._id,
          frameDetails,
          lensName: item.lensName,
          lensCoating: item.lensCoating,
          lensMaterial: item.lensMaterial,
          quantity,
          price,
          subtotal,
          totalAmount: subtotal, // can include tax/shipping later
          paymentMethod: "razorpay",
          razorpay_payment_id,
          paymentStatus: razorpay_payment_id ? "paid" : "pending",
          orderStatus: "processing",
          statusHistory: [{ status: "processing", updatedAt: new Date() }],
        });

        return order;
      })
    );

    // Remove null entries if any
    const validOrders = orders.filter(Boolean);

    // Empty user's cart after successful order creation
    await Cart.findOneAndDelete({ userId });

    return NextResponse.json(
      {
        message: "Orders placed successfully",
        transactionId,
        ordersCount: validOrders.length,
        orderIds: validOrders.map((o: any) => o.orderId),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
