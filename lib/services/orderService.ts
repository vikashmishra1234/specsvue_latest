import Cart from "@/models/Cart";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ContactLens from "@/models/ContactLens";
import { connectToDatabase } from "@/lib/dbConnect";

interface PlaceOrderParams {
  userId: string;
  addressId: string;
  razorpay_payment_id?: string;
  paymentMethod?: string;
}

export async function placeOrder({
  userId,
  addressId,
  razorpay_payment_id,
  paymentMethod = "razorpay",
}: PlaceOrderParams) {
  await connectToDatabase();
  
  // Ensure models are registered
  await Product.init();
  await ContactLens.init();

  console.log(`[OrderService] Placing order for userId: ${userId}`);
  const userCart: any = await Cart.findOne({ userId }).lean();

  if (!userCart || userCart.items.length === 0) {
    throw new Error("Cart not found or empty");
  }

  console.log(`[OrderService] Cart found with ${userCart.items.length} items`);

  const addressDoc = await Address.findOne({ userId });
  const selectedAddress = addressDoc?.addresses?.find(
    (addr: any) => addr._id.toString() === addressId
  );

  if (!selectedAddress) {
    throw new Error("Address not found");
  }

  // Generate a single transaction ID for this checkout
  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Create individual order for each product in cart
  const orders = await Promise.all(
    userCart.items.map(async (item: any) => {
      let product: any = null;
      const productType = item.productType || "Frame";

      if (productType === "ContactLens") {
        product = await ContactLens.findById(item.productId);
      } else {
        product = await Product.findById(item.productId);
      }

      if (!product) {
          console.error(`Product not found for ID: ${item.productId}`);
          return null;
      }

      // Check stock
      const currentStock = Number(product.stock) || 0;
      const orderQty = Number(item.quantity) || 1;

      if (currentStock < orderQty) {
          console.error(`Insufficient stock for product: ${product.name || product.brandName}`);
          // Should we throw here to fail the whole order? 
          // For now, let's throw to trigger the atomic refund flow.
          throw new Error(`Insufficient stock for ${product.name || product.brandName}`);
      }

      // Decrement stock
      // Re-fetch to ensure atomic update if possible, or trust previous fetch if low concurrency.
      // Using $inc is safer for concurrency.
      if (productType === "ContactLens") {
        await ContactLens.findByIdAndUpdate(item.productId, { $inc: { stock: -orderQty } });
      } else {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -orderQty } });
      }

      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price);
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
        paymentMethod,
        razorpay_payment_id,
        paymentStatus: razorpay_payment_id ? "paid" : "pending",
        orderStatus: "processing",
        statusHistory: [{ status: "processing", updatedAt: new Date() }],
        address: selectedAddress, // Save address snapshot
      };

      if (productType === "ContactLens") {
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
          images: product.images,
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

  // Remove null entries
  const validOrders = orders.filter(Boolean);

  // Empty user's cart after successful order creation
  await Cart.findOneAndDelete({ userId });

  return {
    transactionId,
    orders: orders.filter(Boolean),
  };
}
