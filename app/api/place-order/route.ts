import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ContactLens from "@/models/ContactLens";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.userId;
    const { addressId, razorpay_payment_id } = await req.json();

    await connectToDatabase();
    // Ensure models are registered
    await Product.init();
    await ContactLens.init();

    // Fetch cart without populate, populate manually
    const userCart = await Cart.findOne({ userId }).lean();
    
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
        let product: any = null;
        const productType = item.productType || 'Frame';

        if (productType === 'ContactLens') {
             product = await ContactLens.findById(item.productId);
        } else {
             product = await Product.findById(item.productId);
        }

        if (!product) return null;

        // Update stock safely
        const currentStock = Number(product.stock) || 0;
        const orderQty = Number(item.quantity) || 1;
        
        // Decrement stock
        if (productType === 'ContactLens') {
            await ContactLens.findByIdAndUpdate(item.productId, { $inc: { stock: -orderQty } });
        } else {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -orderQty } });
        }

        const quantity = item.quantity || 1;
        const price = Number(item.price); // Use price from cart item to respect purchase time price
        const subtotal = price * quantity;
        
        const orderData: any = {
          orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          transactionId,
          userId,
          productId: product._id,
          productType,
          quantity,
          price,
          subtotal,
          totalAmount: subtotal,
          paymentMethod: "razorpay",
          razorpay_payment_id,
          paymentStatus: razorpay_payment_id ? "paid" : "pending",
          orderStatus: "processing",
          statusHistory: [{ status: "processing", updatedAt: new Date() }],
        };

        if (productType === 'ContactLens') {
            orderData.contactLensDetails = {
                name: product.name,
                brandName: product.brandName,
                lensType: product.lensType,
                power: item.power,
                cylinder: item.cylinder,
                axis: item.axis,
                baseCurve: item.baseCurve,
                diameter: item.diameter,
                color: item.color,
                images: product.images
            };
        } else {
            // Frame Details
             orderData.frameDetails = {
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
            orderData.lensName = item.lensName;
            orderData.lensCoating = item.lensCoating;
            orderData.lensMaterial = item.lensMaterial;
        }

        // Create order document
        const order = await Order.create(orderData);

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
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
