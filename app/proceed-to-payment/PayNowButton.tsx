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
      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all font-medium"
      disabled={loading}
    >
      {loading ? "Placing Order..." : "Pay Now"}
    </button>
  );
}
