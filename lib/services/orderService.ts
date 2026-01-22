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
  console.log(`[OrderService] 🟢 Starting placeOrder for userId: ${userId}`);
  
  try {
    await connectToDatabase();
    console.log(`[OrderService] ✅ DB Connected`);
    
    // Ensure models are registered
    await Product.init();
    await ContactLens.init();
  
    console.log(`[OrderService] Fetching Cart...`);
    const userCart: any = await Cart.findOne({ userId }).lean();
  
    if (!userCart || userCart.items.length === 0) {
      console.warn(`[OrderService] ❌ Cart not found or empty for userId: ${userId}`);
      throw new Error("Cart not found or empty");
    }
  
    console.log(`[OrderService] ✅ Cart found with ${userCart.items.length} items`);
  
    console.log(`[OrderService] Fetching Address...`);
    const addressDoc = await Address.findOne({ userId });
    const selectedAddress = addressDoc?.addresses?.find(
      (addr: any) => addr._id.toString() === addressId
    );
  
    if (!selectedAddress) {
      console.warn(`[OrderService] ❌ Address not found for ID: ${addressId}`);
      throw new Error("Address not found");
    }
    console.log(`[OrderService] ✅ Address found: ${selectedAddress._id}`);
  
    // Generate a single transaction ID for this checkout
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(`[OrderService] 🆔 Generated Transaction ID: ${transactionId}`);
  
    // Create individual order for each product in cart
    const orders = await Promise.all(
      userCart.items.map(async (item: any, index: number) => {
        console.log(`[OrderService] 🔄 Processing Item ${index + 1}/${userCart.items.length} (ID: ${item.productId})`);
        
        let product: any = null;
        const productType = item.productType || "Frame";
  
        if (productType === "ContactLens") {
          product = await ContactLens.findById(item.productId);
        } else {
          product = await Product.findById(item.productId);
        }
  
        if (!product) {
            console.error(`[OrderService] ❌ Product not found for ID: ${item.productId}`);
            return null;
        }
  
        // Check stock
        const currentStock = Number(product.stock) || 0;
        const orderQty = Number(item.quantity) || 1;
        console.log(`[OrderService] 📦 Checking Stock: Current=${currentStock}, Required=${orderQty}`);
  
        if (currentStock < orderQty) {
            console.error(`[OrderService] ❌ Insufficient stock for product: ${product.name || product.brandName}`);
            // Should we throw here to fail the whole order? 
            // For now, let's throw to trigger the atomic refund flow.
            throw new Error(`Insufficient stock for ${product.name || product.brandName}`);
        }
  
        // Decrement stock
        // Re-fetch to ensure atomic update if possible, or trust previous fetch if low concurrency.
        // Using $inc is safer for concurrency.
        console.log(`[OrderService] 📉 Updating Stock for ${product._id}...`);
        if (productType === "ContactLens") {
          await ContactLens.findByIdAndUpdate(item.productId, { $inc: { stock: -orderQty } });
        } else {
          await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -orderQty } });
        }
        console.log(`[OrderService] ✅ Stock Updated`);
  
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
        console.log(`[OrderService] 💾 Saving Order ${orderData.orderId}...`);
        const order = await Order.create(orderData);
        console.log(`[OrderService] ✅ Order Saved: ${order._id}`);
        return order;
      })
    );
  
    // Remove null entries
    const validOrders = orders.filter(Boolean);
  
    // Empty user's cart after successful order creation
    console.log(`[OrderService] 🗑️ Emptying Cart...`);
    await Cart.findOneAndDelete({ userId });
    console.log(`[OrderService] ✅ Cart Emptied. Done.`);
  
    return {
      transactionId,
      orders: orders.filter(Boolean),
    };
  } catch (error) {
    console.error(`[OrderService] 💥 Error in placeOrder:`, error);
    throw error;
  }
}
