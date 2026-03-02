import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Address from "@/models/Address";
import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import ContactLens from "@/models/ContactLens";
import Link from "next/link";
import CheckoutClient from "./CheckoutClient";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.userId) {
    redirect("/login?callbackUrl=/checkout");
  }

  const userId = session.user.userId;
  const userEmail = session.user.email;
  await connectToDatabase();
  await Product.init();
  await ContactLens.init();

  let [addressDoc, cartDoc] = await Promise.all([
    Address.findOne({ userId }),
    Cart.findOne({ userId }),
  ]);

  // Legacy fallback: some older users may have data keyed by email.
  if ((!addressDoc || !cartDoc) && userEmail && userEmail !== userId) {
    if (!addressDoc) {
      const legacyAddressDoc = await Address.findOne({ userId: userEmail });
      if (legacyAddressDoc) {
        legacyAddressDoc.userId = userId;
        await legacyAddressDoc.save();
        addressDoc = legacyAddressDoc;
      }
    }

    if (!cartDoc) {
      const legacyCartDoc = await Cart.findOne({ userId: userEmail });
      if (legacyCartDoc) {
        legacyCartDoc.userId = userId;
        await legacyCartDoc.save();
        cartDoc = legacyCartDoc;
      }
    }
  }

  const userAddressDoc = addressDoc ? addressDoc.toObject() : null;
  const cartRaw = cartDoc ? cartDoc.toObject() : null;

  if (!cartRaw || (cartRaw as any).items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="text-gray-600 mt-2">
              Add products to your cart, then return to checkout.
            </p>
            <div className="mt-6">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-xl bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors"
              >
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Populate Cart Logic
  const populatedCart: any = cartRaw;
  const items = (cartRaw as any).items || [];

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
    productMap.set(product._id.toString(), { ...product, _id: product._id.toString() });
  }
  for (const lens of lensProducts as any[]) {
    productMap.set(lens._id.toString(), { ...lens, _id: lens._id.toString() });
  }

  populatedCart.items = items.map((item: any) => {
    const product = productMap.get(item.productId?.toString?.() || String(item.productId));
    if (!product) return item;
    return { ...item, productId: product };
  });
  
  // Serialize Cart & Address for Client Component
  populatedCart._id = populatedCart._id.toString();
  populatedCart.userId = populatedCart.userId.toString();
  populatedCart.items = populatedCart.items.map((item:any) => ({
      ...item,
      _id: item._id ? item._id.toString() : undefined,
      productId: {
          ...item.productId,
          _id: item.productId._id ? item.productId._id.toString() : undefined
      }
  }));

  const userAddresses = userAddressDoc ? (userAddressDoc as any).addresses.map((addr: any) => ({
      ...addr,
      _id: addr._id.toString()
  })) : [];
  
  const userAddressId = userAddressDoc ? (userAddressDoc as any)._id.toString() : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
            Checkout
        </h1>
        
        <CheckoutClient 
            initialCart={populatedCart} 
            initialAddresses={userAddresses}
            userId={userId}
            userEmail={session.user.email}
        />
      </div>
    </div>
  );
}
