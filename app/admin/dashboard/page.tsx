'use client'; 
import { useEffect, useState } from 'react';
import Overview from './Overview';
import Sidebar from './Sidebar';
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
  const [totalOrders, setTotalOrders] = useState(0);
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
        const [ordersRes, productsRes, usersData] = await Promise.all([
          getAllOrders({ limit: 5 }), 
          getAllProducts({ limit: 12 }), // Fetch first 12 products
          getAllUsers()
        ]);
        
        setUsers(usersData?.data || []);
        setOrders(ordersRes?.data || []);
        setTotalOrders(ordersRes?.pagination?.totalOrders || 0);

        // productsRes is now the object { success, data, pagination }
        setProducts(productsRes?.data || []);
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
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar - Hidden on mobile, handled by desktop style */}
      <Sidebar showThis={showThis} setShowThis={setShowThis} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <AdminHeader setShowThis={setShowThis} />
        
        <main className="flex-1 overflow-x-hidden">
          {showThis === 0 && (
            <Overview 
              users={users?.length || 0} 
              productsLength={products?.length || 0} 
              orders={orders} 
              totalOrders={totalOrders}
              onViewOrders={() => setShowThis(1)}
            />
          )}

          <div className='px-4 sm:px-6 lg:px-8 py-6'>
            {showThis === 1 && <Orders initialOrders={orders} />}
            {showThis === 2 && <Product initialProducts={products} />}
            {showThis === 5 && <ContactLensList />}
            {showThis === 3 && <Priscription  />}
            {showThis === 4 && <AdminSettings  />}
          </div>
        </main>
      </div>
    </div>
  );
}