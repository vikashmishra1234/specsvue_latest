'use client'
import { useEffect, useState } from 'react';
import Overview from './Overview';
import getAllOrders from '@/actions/GetAllOrders';
import getAllProducts from '@/actions/getAllProducts';
import Product from './Products';
import getAllUsers from '@/actions/getAllUsers';
import Orders from './Orders';
import AdminHeader from './AdminHeader';
import Priscription from './Prescription';
import AdminSettings from './Settings';
import ContactLensList from '../contact-lenses/page';

export default function AdminDashboard() {
  const [showThis, setShowThis] = useState(0);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [change,setChange] = useState<boolean>(false)

  useEffect(()=>{

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
      <>
        <AdminHeader setShowThis={setShowThis} />
      <main className="flex px-5 h-screen w-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </main></>
    );
  }

  return (
     <>
      <AdminHeader setShowThis={setShowThis} />
    <main className="flex  w-full bg-gray-50">
      <div className="flex-1 ">
        {showThis === 0 && (
          <Overview 
            users={users?.length || 0} 
            productsLength={products?.length || 0} 
            orders={orders} 
          />
        )}
       <div className='px-5'>
         {showThis===1&&<Orders orders={orders} />}
       </div>
        {showThis === 2 && <Product setChange={setChange} products={products} change={change} />}
        {showThis === 5 && <ContactLensList />}
        {showThis === 3 && <Priscription  />}
        {showThis === 4 && <AdminSettings  />}
      </div>
    </main>
     </>
  );
}