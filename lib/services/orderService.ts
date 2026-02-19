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

  const userCart: any = await Cart.findOne({ userId }).lean();
  if (!userCart || userCart.items.length === 0) {
    throw new Error("Cart not found or empty");
  }

  const addressDoc = await Address.findOne({ userId });
  const selectedAddress = addressDoc?.addresses?.find(
    (addr: any) => addr._id.toString() === addressId
  );
  if (!selectedAddress) {
    throw new Error("Address not found");
  }

  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const items = userCart.items || [];

  const frameProductIds = items
    .filter((item: any) => item.productType !== "ContactLens")
    .map((item: any) => item.productId);
  const lensProductIds = items
    .filter((item: any) => item.productType === "ContactLens")
    .map((item: any) => item.productId);

  const [frameProducts, lensProducts] = await Promise.all([
    frameProductIds.length ? Product.find({ _id: { $in: frameProductIds } }).lean() : [],
    lensProductIds.length ? ContactLens.find({ _id: { $in: lensProductIds } }).lean() : [],
  ]);

  const productMap = new Map<string, any>();
  for (const product of frameProducts as any[]) {
    productMap.set(product._id.toString(), product);
  }
  for (const product of lensProducts as any[]) {
    productMap.set(product._id.toString(), product);
  }

  const orders = await Promise.all(
    items.map(async (item: any) => {
      const productType = item.productType || "Frame";
      const product = productMap.get(item.productId.toString());
      if (!product) return null;

      const quantity = Number(item.quantity) || 1;
      const currentStock = Number(product.stock) || 0;
      if (currentStock < quantity) {
        throw new Error(`Insufficient stock for ${product.name || product.brandName}`);
      }

      const stockQuery = { _id: item.productId, stock: { $gte: quantity } };
      const stockUpdate = { $inc: { stock: -quantity } };
      const stockUpdateResult =
        productType === "ContactLens"
          ? await ContactLens.updateOne(stockQuery, stockUpdate)
          : await Product.updateOne(stockQuery, stockUpdate);

      if (!stockUpdateResult.modifiedCount) {
        throw new Error(`Insufficient stock for ${product.name || product.brandName}`);
      }

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
        address: selectedAddress,
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

      return Order.create(orderData);
    })
  );

  await Cart.findOneAndDelete({ userId });

  return {
    transactionId,
    orders: orders.filter(Boolean),
  };
}
