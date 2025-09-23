// app/proceed-to-payment/review/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Address from "@/models/Address";
import { connectToDatabase } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Link from "next/link";
import { PayNowButton } from "../PayNowButton";
import { CheckCircle, MapPin, Phone, Package, CreditCard } from "lucide-react";
import Product from "@/models/Product";

export default async function Review({
  searchParams,
}: {
  searchParams: { addressId?: string; cartId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.userId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg border border-red-100">
        <div className="text-red-500 font-semibold text-lg mb-3">
          You must be logged in to view this page
        </div>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Login to continue
        </Link>
      </div>
    );
  }

  const userId = session.user.userId;
  await connectToDatabase();

  let addressData = null;
  if (searchParams.addressId) {
    const Invokeporduct = Product;
    await Product.find({})
    const userAddressDoc = await Address.findOne({ userId });
    addressData = userAddressDoc?.addresses?.find(
      (addr: any) => addr._id.toString() === searchParams.addressId
    );
  }

  let cartData = null;
  if (searchParams.cartId) {
    cartData = await Cart.findOne({ userId }).populate("items.productId");
  }

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Order Review
        </h1>
      </div>
 <div className="md:col-span-1 mb-3 sm:hidden">
          <div className="sticky top-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center p-4 bg-gray-50 border-b">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Order Summary
              </h2>
            </div>

            {cartData ? (
              <div className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{cartData.cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">Included</span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-semibold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-xl text-gray-700">
                      ₹{cartData.cartTotal}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <PayNowButton
                    userId={userId}
                    cartId={searchParams.cartId}
                    addressId={searchParams.addressId!}
                    cartTotal={cartData.cartTotal}
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <p className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    <span>Secure payment processed by trusted partners</span>
                  </p>
                  <p className="flex items-center mt-1">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    <span>Free shipping and easy returns</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 text-gray-500">
                No cart information available.
              </div>
            )}
          </div>
        </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
              <h2 className="flex items-center text-lg font-semibold text-gray-800">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Shipping Address
              </h2>
              <Link
                href="/proceed-to-payment/address"
                className="text-sm text-blue-600 hover:underline"
              >
                Change
              </Link>
            </div>

            {addressData ? (
              <div className="p-4">
                <p className="font-medium text-gray-900">{addressData.name}</p>
                <p className="text-gray-700 mt-1">
                  {addressData.houseNumberOrBuildingName},{" "}
                  {addressData.areaOrLocality}
                </p>
                <p className="text-gray-700">
                  {addressData.landmark && `${addressData.landmark}, `}
                  Pincode: {addressData.pincode}
                </p>
                <p className="flex items-center mt-2 text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  {addressData.phone}
                </p>
              </div>
            ) : (
              <div className="p-4 text-gray-500">
                No address selected. Please go back and select an address.
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center p-4 bg-gray-50 border-b">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Order Items
              </h2>
            </div>

            {cartData && cartData.items.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {cartData.items.map((data: any, index: number) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={data.productId.images[0]}
                          alt={`${data.productId.brandName} ${data.productId.frameType}`}
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900">
                          {data.productId.brandName} {data.productId.frameType}
                        </h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm">
                          <p className="text-gray-600">
                            <span className="font-medium">Frame Shape:</span>{" "}
                            {data.productId.frameShape}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Collection:</span>{" "}
                            {data.productId.collection}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Temple Color:</span>{" "}
                            {data.productId.templeColor}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Product Type:</span>{" "}
                            {data.productId.productType}
                          </p>
                        </div>
                        <div className="mt-3 py-2 px-3 bg-blue-50 rounded-md">
                          <p className="text-blue-800 text-sm font-medium">
                            Lens Details
                          </p>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-sm">
                            <p className="text-gray-700">
                              <span className="font-medium">Lens:</span>{" "}
                              {data.lensName}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Coating:</span>{" "}
                              {data.lensCoating}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Material:</span>{" "}
                              {data.lensMaterial}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-gray-500">Your cart is empty.</div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="sticky top-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center p-4 bg-gray-50 border-b">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Order Summary
              </h2>
            </div>

            {cartData ? (
              <div className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{cartData.cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">Included</span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-semibold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-xl text-gray-700">
                      ₹{cartData.cartTotal}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <PayNowButton
                    userId={userId}
                    cartId={searchParams.cartId}
                    addressId={searchParams.addressId!}
                    cartTotal={cartData.cartTotal}
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <p className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    <span>Secure payment processed by trusted partners</span>
                  </p>
                  <p className="flex items-center mt-1">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    <span>Free shipping and easy returns</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 text-gray-500">
                No cart information available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
