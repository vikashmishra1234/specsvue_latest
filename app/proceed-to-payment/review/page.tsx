
// app/proceed-to-payment/review/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Address from "@/models/Address";
import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Link from "next/link";
import { PayNowButton } from "../PayNowButton";
import { CheckCircle, MapPin, Phone, Package, CreditCard } from "lucide-react";
import Product from "@/models/Product";
import ContactLens from "@/models/ContactLens";

export default async function Review({
  searchParams,
}: {
  searchParams: Promise<{ addressId?: string; cartId: string }>;
}) {
  const { addressId, cartId } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.userId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in required</h2>
        <p className="text-gray-500 mb-6">Please log in to review your order.</p>
        <Link
          href="/login"
          className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition shadow-lg"
        >
          Login to Continue
        </Link>
      </div>
    );
  }

  const userId = session.user.userId;
  await connectToDatabase();
  // Ensure models are registered
  await Product.init();
  await ContactLens.init();

  let addressData = null;
  if (addressId) {
    const userAddressDoc = await Address.findOne({ userId });
    addressData = userAddressDoc?.addresses?.find(
      (addr: any) => addr._id.toString() === addressId
    );
  }

  let cartData: any = null;
  if (cartId) {
    // Manual population due to mixed product types
    const cartRaw: any = await Cart.findOne({ userId }).lean();
    if(cartRaw) {
        cartData = cartRaw;
        cartData.items = await Promise.all(cartRaw.items.map(async (item: any) => {
            let populatedProduct: any = null;
            if (item.productType === 'ContactLens') {
                populatedProduct = await ContactLens.findById(item.productId).lean();
            } else {
                populatedProduct = await Product.findById(item.productId).lean();
            }
            return { ...item, productId: populatedProduct || item.productId };
        }));
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Review Order
        </h1>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Final Step
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Address Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="flex items-center text-lg font-bold text-gray-900 gap-2">
                <MapPin className="w-5 h-5 text-gray-900" />
                Shipping Address
              </h2>
              <Link
                href="/proceed-to-payment/address"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Change
              </Link>
            </div>

            {addressData ? (
              <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{addressData.name}</h3>
                        <p className="text-gray-600 leading-relaxed">
                        {addressData.houseNumberOrBuildingName}, {addressData.areaOrLocality}
                        </p>
                        <p className="text-gray-600">
                        {addressData.landmark && `${addressData.landmark}, `}
                        <span className="font-medium text-gray-900">{addressData.pincode}</span>
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                            <Phone className="w-3.5 h-3.5" />
                            {addressData.phone}
                        </div>
                    </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 italic bg-gray-50">
                No address selected. Please select an address to proceed.
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <Package className="w-5 h-5 mr-3 text-gray-900" />
              <h2 className="text-lg font-bold text-gray-900">
                Items in Your Order <span className="text-gray-400 font-normal ml-1">({cartData?.items?.length || 0})</span>
              </h2>
            </div>

            {cartData && cartData.items.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {cartData.items.map((data: any, index: number) => (
                  <div key={index} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-100 p-2 flex items-center justify-center">
                        <img
                          src={data?.productId?.images?.[0] || '/no-image.png'}
                          alt={data.productId ? (data.productId.brandName || data.productId.name) : "Product"}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-grow">
                        {data.productType === 'ContactLens' ? (
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">
                                    {data.productId?.name}
                                    </h3>
                                    <p className="text-sm font-medium text-blue-600">{data.productId?.brandName} • {data.productId?.lensType}</p>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Prescription Details
                                  </p>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                                    <p className="text-gray-700">
                                      <span className="text-gray-400 mr-2">Power</span> 
                                      <span className="font-semibold">{data.power || 'N/A'}</span>
                                    </p>
                                    {data.cylinder && <p><span className="text-gray-400 mr-2">Cyl</span> <span className="font-semibold">{data.cylinder}</span></p>}
                                    {data.axis && <p><span className="text-gray-400 mr-2">Axis</span> <span className="font-semibold">{data.axis}</span></p>}
                                    {data.baseCurve && <p><span className="text-gray-400 mr-2">BC</span> <span className="font-semibold">{data.baseCurve}</span></p>}
                                    {data.color && <p><span className="text-gray-400 mr-2">Color</span> <span className="font-semibold">{data.color}</span></p>}
                                  </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">
                                    {data.productId?.brandName} {data.productId?.modelNumber}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {data.productId?.frameColor} • {data.productId?.frameShape} • {data.productId?.frameType}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Configuration
                                    </p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <p className="text-gray-700">
                                            <span className="text-gray-400 mr-2">Lens</span> 
                                            <span className="font-semibold">{data.lensName || 'Frame Only'}</span>
                                        </p>
                                        {data.lensMaterial && (
                                            <p>
                                                <span className="text-gray-400 mr-2">Material</span>
                                                <span className="font-semibold">{data.lensMaterial}</span>
                                            </p>
                                        )}
                                        {data.productType && (
                                            <p className="col-span-2">
                                                <span className="text-gray-400 mr-2">Type</span>
                                                <span className="font-semibold text-gray-900">{data.productType}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                         <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                             <span className="text-sm text-gray-500 font-medium">Qty: {data.quantity}</span>
                             <span className="font-bold text-gray-900 text-lg">₹{data.price * data.quantity}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 bg-gray-50">Your cart is empty.</div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gray-50/50 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-900" />
                Payment Details
              </h2>
            </div>

            {cartData ? (
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{cartData.cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-900">Included</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Payable</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{cartData.cartTotal}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <PayNowButton
                    userId={userId}
                    cartId={cartId}
                    addressId={addressId!}
                    cartTotal={cartData.cartTotal}
                  />
                </div>

                <div className="mt-6 space-y-3 pt-6 border-t border-gray-100 text-xs text-gray-500 bg-gray-50 -mx-6 -mb-6 p-6">
                  <p className="flex items-center gap-2">
                    <div className="p-1 bg-green-100 rounded-full text-green-600"><CheckCircle size={12} /></div>
                    <span className="font-medium">Secure SSL Encrypted Payment</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <div className="p-1 bg-green-100 rounded-full text-green-600"><CheckCircle size={12} /></div>
                    <span className="font-medium">100% Authentic Products Guarantee</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-gray-500 italic text-center">
                Cart information unavailable.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
