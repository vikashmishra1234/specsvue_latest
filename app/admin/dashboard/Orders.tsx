'use client'

import ShowOrders from '@/app/components/ShowOrders'
import React from 'react'

interface OrderProps {
  orders: ProductType[];
}

const Orders: React.FC<OrderProps> = ({ orders }) => {
    if(!orders){
        return null;
    }
  return (
    <div className="max-w-5xl mx-auto py-8">
      {orders.map((order, index) => (
       <div className='mb-6'>
         <ShowOrders key={index} isAdmin={true} order={order} />
       </div>
      ))}
    </div>
  );
};

export default Orders;
