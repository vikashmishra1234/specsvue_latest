"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface CartItem {
  product: Product;
  boxCount: number;
  leftSPH?: string | null;
  rightSPH?: string | null;
}

interface CartResponse {
  items: CartItem[];
  cartTotal: number;
}

const CartPage = () => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = session?.user.userId || localStorage.getItem("guestId");

    if (!userId) return;

    const loadCart = async () => {
      try {
        const res = await axios.get(`/api/get-contactlens?userId=${userId}`);
        setCart(res.data.cart);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [session]);

  if (loading) return <div className="p-6 text-center">Loading cart...</div>;

  if (!cart || cart.items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-56 text-gray-600">
        <p className="text-lg">🛒 Your cart is empty</p>
        <p className="text-sm text-gray-500">Add some products to continue</p>
      </div>
    );

  return (
    <div className="p-4 md:p-10 flex flex-col md:flex-row gap-8">
      {/* LEFT: Cart items */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-semibold mb-2">Shopping Cart</h2>

        {cart.items.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 border rounded-2xl shadow-sm bg-white"
          >
            <img
              src={item.product.images?.[0]}
              alt={item.product.name}
              className="w-24 h-24 rounded-lg object-cover"
            />

            <div className="flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-sm text-gray-700">₹{item.product.price}</p>
              </div>

              <div className="text-xs text-gray-500 mt-1">
                Boxes: {item.boxCount} <br />
                SPH: L {item.leftSPH || "-"} | R {item.rightSPH || "-"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Summary */}
      <div className="md:w-80 w-full sticky top-4 h-fit border p-6 rounded-2xl shadow-md bg-white">
        <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₹{cart.cartTotal}</span>
        </div>

        <div className="flex justify-between mt-2 text-base font-semibold border-t pt-3">
          <span>Total</span>
          <span>₹{cart.cartTotal}</span>
        </div>

        <button className="w-full mt-5 bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition">
          Continue
        </button>
      </div>
    </div>
  );
};

export default CartPage;
