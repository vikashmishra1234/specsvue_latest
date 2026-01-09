"use client";
import CartCard from "./CartCard";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import getUserCart from "@/actions/getUserCart";
import { useEffect, useState } from "react";
import ContactLensCartCard from "./ContactLensCartCard";
import { useSession } from "next-auth/react";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

export default function ProductsPage() {
  const { data: session } = useSession();
  const [change, setChange] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  /* const { products } = useSelector((state: any) => state.cart); */
  const [currentUserCart, setCurrentCart] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'frames' | 'lenses'>('frames');

  // Fetch cart on load
  useEffect(() => {
    const userId = session?.user?.userId || localStorage.getItem("guestId");
    if(userId){
        (async () => {
        setLoading(true);
        const res = await getUserCart(userId as string);
        setLoading(false);
        if(res?.success) setCurrentCart(res.data);
        })();
    }
  }, [session, change]);

/*
  useEffect(() => {
     setCurrentCart(products);
   }, [products]);
*/
  if (loading) {
    return <Loading />;
  }
  if (!currentUserCart || currentUserCart?.items?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven’t added anything to your cart yet.
        </p>
        <Link href="/products">
          <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
            Shop Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fbf9f7] min-h-screen py-10 px-4 md:px-10">
      <div className="max-w-7xl m-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Your Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Cart Items */}
          <div className="flex-1 space-y-6">
            
            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button 
                    onClick={() => setActiveTab('frames')}
                    className={`px-4 py-2 font-medium ${activeTab === 'frames' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
                >
                    Frames
                </button>
                <button 
                    onClick={() => setActiveTab('lenses')}
                    className={`px-4 py-2 font-medium ${activeTab === 'lenses' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
                >
                    Contact Lenses
                </button>
            </div>

            {currentUserCart?.items ? (
              (() => {
                  const items = currentUserCart.items.filter((item: any) => 
                      activeTab === 'frames' 
                      ? (item.productType === 'Frame' || !item.productType) 
                      : item.productType === 'ContactLens'
                  );

                  if (items.length === 0) return <p className="text-gray-500 py-4">No items in this category.</p>;

                  return items.map((data: any, ind: number) => (
                    <div key={ind}>
                      {activeTab === 'frames' ? (
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
                  ));
              })()
            ) : (
              <h3>your cart is empty</h3>
            )}
          </div>

          {/* Right - Cart Summary */}
          <div className="w-full lg:w-[300px] bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Total Items:</span>
              <span>{currentUserCart?.items?.length}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total Price:</span>
              <span>₹{currentUserCart?.cartTotal}</span>
            </div>
            <Link
              href={"/proceed-to-payment/address"}
              className="w-full px-16 bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
