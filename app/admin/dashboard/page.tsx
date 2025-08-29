'use client'
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import getAllOrders from '@/actions/GetAllOrders';
import getAllProducts from '@/actions/getAllProducts';
import Product from './Products';
import getAllUsers from '@/actions/getAllUsers';
import Orders from './Orders';

export default function AdminDashboard() {
  const [showThis, setShowThis] = useState(0);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [change,setChange] = useState<boolean>(false)

  useEffect(()=>{
    // (async () => {
    //   try {
    //     alert("Deleting all orders");
    //     const res = await fetch('/api/delete-order', {
    //       method: 'DELETE',
    //     });
    //     if (res.ok) {
    //       console.log('All orders deleted successfully');
    //     } else {
    //       console.error('Failed to delete orders');
    //     }
    //   } catch (error) {
    //     console.error('Error deleting orders:', error);
    //   }
    // })();

localStorage.setItem(
  "nextauth.message",
  JSON.stringify({event:"session",data:{"trigger":"getSession"},timestamp:1754911483})
);
  },[])

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [ordersData, productsData, usersData] = await Promise.all([
          getAllOrders(),
          getAllProducts(),
          getAllUsers()
        ]);
        
        setUsers(usersData?.data || []);
        setOrders(ordersData?.data || []);
        setProducts(productsData?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [change]);

  if (loading) {
    return (
      <main className="flex h-screen w-full">
        <Sidebar setShowThis={setShowThis} />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-full bg-gray-50">
      <Sidebar setShowThis={setShowThis} />
      <div className="flex-1 overflow-auto">
        {showThis === 0 && (
          <Overview 
            users={users?.length || 0} 
            productsLength={products?.length || 0} 
            orders={orders} 
          />
        )}
        {showThis===1&&<Orders orders={orders} />}
        {showThis === 2 && <Product setChange={setChange} products={products} change={change} />}
      </div>
    </main>
  );
}