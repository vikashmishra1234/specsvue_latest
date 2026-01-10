
import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllUserOrders } from "@/actions/ServerSideFetching";
import { Package, Truck, CheckCircle2, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default async function UserOverviewPage() {
  const session = await getServerSession(authOptions);
  
  // If no session, handled by layout usually, but safe check
  if (!session?.user?.userId) {
      return null; 
  }

  const orders = await getAllUserOrders(session.user.userId) || [];
  
  // Calculate Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: any) => o.orderStatus === 'processing' || o.orderStatus === 'shipped').length;
  const deliveredOrders = orders.filter((o: any) => o.orderStatus === 'delivered').length;

  const recentOrders = orders.slice(0, 3); // Top 3

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
         <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12"></div>
         <div className="relative z-10">
             <h1 className="text-3xl font-bold mb-2">Welcome Back, {session.user.name?.split(' ')[0]}! 👋</h1>
             <p className="text-gray-300 max-w-lg">Track your orders, manage your profile, and explore the latest eyewear collections tailored just for you.</p>
             
             <div className="mt-6 flex gap-4">
                 <Link href="/products" className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-full hover:bg-blue-50 transition shadow-lg flex items-center gap-2">
                    <ShoppingBag size={18} /> Start Shopping
                 </Link>
             </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                   <Package size={28} />
               </div>
               <div>
                   <p className="text-sm text-gray-500 font-medium h-5">Total Orders</p>
                   <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
               </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
               <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                   <Truck size={28} />
               </div>
               <div>
                   <p className="text-sm text-gray-500 font-medium h-5">In Progress</p>
                   <h3 className="text-2xl font-bold text-gray-900">{pendingOrders}</h3>
               </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
               <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <CheckCircle2 size={28} />
               </div>
               <div>
                   <p className="text-sm text-gray-500 font-medium h-5">Delivered</p>
                   <h3 className="text-2xl font-bold text-gray-900">{deliveredOrders}</h3>
               </div>
          </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link href={`/user/orders/${session.user.userId}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  View All
              </Link>
          </div>
          
          <div className="p-6">
              {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                      {recentOrders.map((order: any) => {
                          const isContactLens = order.productType === 'ContactLens';
                          const image = isContactLens ? order.contactLensDetails?.images?.[0] : order.frameDetails?.images?.[0];
                          const name = isContactLens ? order.contactLensDetails?.name : order.frameDetails?.brandName + ' ' + order.frameDetails?.modelNumber;
                          
                          return (
                              <div key={order._id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                  <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-sm flex-shrink-0">
                                      <Image 
                                        src={image || "/no-image.png"} 
                                        alt={name || "Product"} 
                                        width={64} 
                                        height={64} 
                                        className="w-full h-full object-contain rounded-lg"
                                      />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-gray-900 truncate">{name}</h4>
                                      <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
                                  </div>
                                  <div className="text-right">
                                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                          'bg-yellow-100 text-yellow-700'
                                      }`}>
                                          {order.orderStatus}
                                      </span>
                                      <p className="text-sm font-bold text-gray-900 mt-1">₹{order.totalAmount}</p>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              ) : (
                  <div className="text-center py-10">
                      <p className="text-gray-500">No orders yet.</p>
                      <Link href="/products" className="text-blue-600 font-semibold text-sm hover:underline mt-2 inline-block">Start Shopping</Link>
                  </div>
              )}
          </div>
      </div>
      
    </div>
  );
};
