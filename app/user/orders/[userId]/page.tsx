"use client"

// import CancelItemButton from "./CancelItemButton";
import ShowOrders from "@/app/components/ShowOrders";
import { useEffect, useState } from "react";
import axios from "axios";

export default  function OrdersPage({ params }: { params: { userId: string } }) {
  
  const [orders,setOrders] = useState([])
  useEffect(()=>{
    (async()=>{
      const userId = params?.userId as string;
      const res:any = await axios.get(`/api/get-all-orders?userId=${userId}`)
      console.log(res)
      setOrders(res?.data)
    })()
  },[params?.userId])
  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600 text-lg">
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Your Orders</h2>

      <div className="space-y-10">
        {orders.map((order: any, orderIndex: number) => (
          <ShowOrders key={orderIndex} isAdmin={false} order={order} />
        ))}
      </div>
    </div>
  );
}
