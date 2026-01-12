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
  await connectToDatabase();
  await Product.init();
  await ContactLens.init();

  // Parallel Data Fetching
  const [userAddressDoc, cartRaw] = await Promise.all([
    Address.findOne({ userId }).lean(),
    Cart.findOne({ userId }).lean()
  ]);

  if (!cartRaw || (cartRaw as any).items.length === 0) {
      redirect("/cart");
  }

  // Populate Cart Logic
  const populatedCart: any = cartRaw;
  populatedCart.items = await Promise.all((cartRaw as any).items.map(async (item: any) => {
    let populatedProduct: any = null;
    if (item.productType === 'ContactLens') {
        populatedProduct = await ContactLens.findById(item.productId).lean();
    } else {
        populatedProduct = await Product.findById(item.productId).lean();
    }
    // Safety check if product was deleted
    if(!populatedProduct) return item; 
    
    // Convert _id to string to avoid serialization issues
    populatedProduct._id = populatedProduct._id.toString();
    return { ...item, productId: populatedProduct };
  }));
  
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
