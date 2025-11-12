"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useAddress } from "@/actions/fetchProducts";
import Address from "./Address";
import { fetchProducts } from "@/store/cartSlice";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";

const Page = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If session is still loading, don't do anything yet
    if (status === "loading") return;
    const fetchCart = async () => {
      await dispatch(fetchProducts(session?.user.userId as string));
      setIsLoading(false);
    };

    fetchCart();
  }, [status, session?.user?.userId, dispatch, router]);

  const { data: existingAddresses } = useAddress(session?.user?.userId || "");
  const { products } = useSelector((state: any) => state.cart);

  if (isLoading) {
    return <Loading />;
  }

  // Optional: Uncomment if you want to redirect when cart is empty
  if (!products) {
    alert("your cart is empty")
    router.push("/cart");
    return null;
  }

  return (
    <div className="bg-[#f6f5fc] pt-5">
      <div className="max-w-7xl mx-auto">
        <div className="min-h-screen">
          <Address
            userId={session?.user.userId}
            email={session?.user.email}
            cart={products}
            existingAddresses={existingAddresses}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
