"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleCheckout } from "../components/client-components/CheckOutButton";

export function PayNowButton({
  userId,
  cartId,
  addressId,
  cartTotal,
}: {
  userId: string;
  cartId: string;
  addressId: string;
  cartTotal: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  return (
    <button
      onClick={() => handleCheckout(cartTotal, userId,addressId,router,setLoading)}
      className="w-full bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition-all font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.99] flex justify-center items-center gap-2"
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">Processing <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div></span>
      ) : (
        "Pay Securely Now"
      )}
    </button>
  );
}
