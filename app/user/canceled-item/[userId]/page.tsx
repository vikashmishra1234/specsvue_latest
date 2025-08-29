"use client"
import ShowOrders from '@/app/components/ShowOrders';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const params = useParams();
    const userId = params.userId as string;
      const [orders,setOrders] = useState([])

  useEffect(()=>{
    (async()=>{
      const userId = params?.userId as string;
      const res:any = await axios.get(`/api/get-all-orders?userId=${userId}`)
      const cancelledOrders = res?.data.filter((order: any) => order.orderStatus === 'cancelled');

      setOrders(cancelledOrders);
    })()
  },[userId]);

    if (!orders || orders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600 text-lg">
        You have no cancelled orders yet.
      </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto px-1 md:px-4 py-2 md:py-9">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-8">Your Orders</h2>

      <div className="space-y-10">
        {orders.map((order: any, orderIndex: number) => (
          <ShowOrders key={orderIndex} isAdmin={false} order={order} isCancell={true} />
        ))}
      </div>
    </div>
  )
}

export default Page