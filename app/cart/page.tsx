"use client";
import CartCard from "./CartCard";
import Link from "next/link";
import { ShoppingCart, ArrowRight, ShieldCheck } from "lucide-react";
import getUserCart from "@/actions/getUserCart";
import { useEffect, useState } from "react";
import ContactLensCartCard from "./ContactLensCartCard";
import { useSession } from "next-auth/react";
import Loading from "../components/Loading";

export default function ProductsPage() {
  const { data: session } = useSession();
  const [change, setChange] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [currentUserCart, setCurrentCart] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"frames" | "lenses">("frames");

  // Fetch cart on load
  useEffect(() => {
    const userId = session?.user?.userId || localStorage.getItem("guestId");
    if (userId) {
      (async () => {
        setLoading(true);
        const res = await getUserCart(userId as string);
        setLoading(false);
        if (res?.success) {
          const cart = res.data;
          setCurrentCart(cart);

          // Smart Tab Switching
          if (cart?.items?.length > 0) {
            const hasFrames = cart.items.some(
              (item: any) => item.productType === "Frame" || !item.productType
            );
            const hasLenses = cart.items.some(
              (item: any) => item.productType === "ContactLens"
            );

            if (hasFrames) {
              setActiveTab("frames");
            } else if (hasLenses) {
              setActiveTab("lenses");
            }
          }
        }
      })();
    }
  }, [session, change]);

  if (loading) {
    return <Loading />;
  }

  if (!currentUserCart || currentUserCart?.items?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-gray-50/50">
        <div className="bg-white p-6 rounded-full shadow-sm mb-6">
          <ShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our
          collection today!
        </p>
        <Link href="/products">
          <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2">
            Start Shopping <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    );
  }

  const framesItems = currentUserCart.items.filter(
    (item: any) => item.productType === "Frame" || !item.productType
  );
  const lensesItems = currentUserCart.items.filter(
    (item: any) => item.productType === "ContactLens"
  );

  const framesCount = framesItems.reduce(
    (sum: number, item: any) => sum + Number(item.quantity || 1),
    0
  );
  const lensesCount = lensesItems.reduce(
    (sum: number, item: any) => sum + Number(item.quantity || 1),
    0
  );
  const totalItemsCount = (currentUserCart.items || []).reduce(
    (sum: number, item: any) => sum + Number(item.quantity || 1),
    0
  );
  const calculatedSubtotal = (currentUserCart.items || []).reduce(
    (sum: number, item: any) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const activeItems = activeTab === "frames" ? framesItems : lensesItems;

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Your Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left - Cart Items */}
          <div className="flex-1 space-y-6">
            {/* Modern Tabs */}
            <div className="flex bg-gray-200/50 p-1.5 rounded-full w-fit mb-6">
              <button
                onClick={() => setActiveTab("frames")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "frames"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Eyeglasses ({framesCount})
              </button>
              <button
                onClick={() => setActiveTab("lenses")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === "lenses"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Contact Lenses ({lensesCount})
              </button>
            </div>

            <div className="space-y-6">
              {activeItems.length > 0 ? (
                activeItems.map((data: any, ind: number) => (
                  <div key={ind}>
                    {activeTab === "frames" ? (
                      <CartCard
                        setChange={setChange}
                        session={session}
                        data={data}
                      />
                    ) : (
                      <ContactLensCartCard
                        setChange={setChange}
                        session={session}
                        data={data}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-gray-500">
                  <p>No items in this category.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Cart Summary */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-medium text-gray-900">
                    {totalItemsCount}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    Rs.{calculatedSubtotal}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Delivery</span>
                  <span className="font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8 pt-4 border-t">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  Rs.{calculatedSubtotal}
                </span>
              </div>

              <Link href={"/checkout"} className="block w-full">
                <button className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-all font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98]">
                  Checkout
                </button>
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-2 rounded-lg">
                <ShieldCheck size={14} className="text-green-600" />
                Secure Payment - 100% Authentic Products
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
