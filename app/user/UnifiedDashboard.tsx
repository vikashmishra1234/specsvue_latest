"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Package,
  ShoppingCart,
  XCircle,
  HelpCircle,
  LogOut,
  User as UserIcon,
  ChevronRight,
  Truck,
  CheckCircle2,
  ShoppingBag,
  Menu,
  X
} from "lucide-react";
import Swal from "sweetalert2";
import ShowOrders from "@/app/components/ShowOrders";

// Types
type User = {
  picture: string;
  name: string;
  email: string;
};

interface UnifiedDashboardProps {
  user: User;
  userId: string;
  orders: any[];
}

export default function UnifiedDashboard({ user, userId, orders }: UnifiedDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync state with URL
  const setActiveTab = (tab: string) => {
    router.push(`/user?tab=${tab}`, { scroll: false });
    setIsMobileMenuOpen(false); // Close mobile menu on navigate
  };

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: <UserIcon size={18} /> },
    { id: "orders", name: "My Orders", icon: <Package size={18} /> },
    { id: "cart", name: "Shopping Cart", icon: <ShoppingCart size={18} />, external: true, href: "/cart" },
    { id: "cancelled", name: "Cancelled Items", icon: <XCircle size={18} /> },
    // { id: "help", name: "Help & Support", icon: <HelpCircle size={18} /> },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#3B82F6",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      await signOut({ callbackUrl: "/login" });
    }
  };

  // --- DERIVED DATA ---
  const filteredOrders = useMemo(() => {
    return orders.map(o => ({
       ...o, 
       // Ensure status/pricing consistency if needed
    }));
  }, [orders]);

  const activeOrders = useMemo(() => filteredOrders.filter((o: any) => o.orderStatus !== 'cancelled'), [filteredOrders]);
  const cancelledOrders = useMemo(() => filteredOrders.filter((o: any) => o.orderStatus === 'cancelled'), [filteredOrders]);
  
  const pendingCount = activeOrders.filter((o: any) => o.orderStatus === 'processing' || o.orderStatus === 'shipped').length;
  const deliveredCount = activeOrders.filter((o: any) => o.orderStatus === 'delivered').length;
  const recentOrders = activeOrders.slice(0, 3);

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12"></div>
               <div className="relative z-10">
                   <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back, {user.name?.split(' ')[0]}! 👋</h1>
                   <p className="text-gray-300 max-w-lg text-sm md:text-base">Track your orders, manage your profile, and explore the latest eyewear collections.</p>
                   
                   <div className="mt-6 flex gap-4">
                       <Link href="/products" className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-full hover:bg-blue-50 transition shadow-lg flex items-center gap-2">
                          <ShoppingBag size={18} /> Start Shopping
                       </Link>
                   </div>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatsCard icon={<Package size={28} />} label="Total Orders" value={activeOrders.length} color="blue" />
                <StatsCard icon={<Truck size={28} />} label="In Progress" value={pendingCount} color="yellow" />
                <StatsCard icon={<CheckCircle2 size={28} />} label="Delivered" value={deliveredCount} color="green" />
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        View All
                    </button>
                </div>
                
                <div className="p-6">
                    {recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order: any) => (
                                <OrderSummaryItem key={order.orderId} order={order} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
          </div>
        );
      
      case "orders":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <h2 className="text-2xl font-bold text-gray-900">Your Orders <span className="text-gray-500 text-lg font-normal">({activeOrders.length})</span></h2>
             
             {activeOrders.length > 0 ? (
               <div className="space-y-8">
                 {activeOrders.map((order: any, idx: number) => (
                   <ShowOrders key={idx} isAdmin={false} order={order} />
                 ))}
               </div>
             ) : (
               <EmptyState />
             )}
          </div>
        );

      case "cancelled":
        return (
             <div className="space-y-6 animate-in fade-in duration-300">
             <h2 className="text-2xl font-bold text-gray-900">Cancelled Orders <span className="text-gray-500 text-lg font-normal">({cancelledOrders.length})</span></h2>
             
             {cancelledOrders.length > 0 ? (
               <div className="space-y-8">
                 {cancelledOrders.map((order: any, idx: number) => (
                   <ShowOrders key={idx} isAdmin={false} order={order} isCancell={true} />
                 ))}
               </div>
             ) : (
               <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500">No cancelled orders found.</p>
               </div>
             )}
          </div>
        );
        
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8 min-h-[80vh]">
        
        {/* Mobile Header / Menu Toggle */}
        <div className="lg:hidden col-span-12 mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-3">
              <Image 
                src={user.picture || "/placeholder-user.jpg"} 
                width={40} height={40} 
                className="rounded-full border border-gray-200" 
                alt="User" 
              />
              <span className="font-bold text-gray-800">{user.name}</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-gray-100 rounded-lg">
              {isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
           </button>
        </div>

        {/* SIDEBAR (Desktop + Mobile) */}
        <div className={`
             lg:col-span-3 lg:block mb-8 lg:mb-0
             ${isMobileMenuOpen ? 'block' : 'hidden'}
        `}>
          <aside className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
            
            {/* Desktop Profile Header */}
            <div className="hidden lg:block relative pt-8 pb-6 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
              <div className="absolute top-0 left-0 w-full h-24 bg-white/10 opacity-30 blur-2xl rounded-b-full"></div>
              
              <div className="relative inline-block mb-4">
                  <div className="p-1 bg-white/20 backdrop-blur-sm rounded-full">
                      <Image
                          src={user.picture || "/placeholder-user.jpg"}
                          alt={user.name}
                          width={88}
                          height={88}
                          className="rounded-full object-cover border-4 border-white shadow-md bg-white w-24 h-24"
                      />
                  </div>
              </div>
              
              <h2 className="text-xl font-bold truncate tracking-tight">{user.name}</h2>
              <p className="text-blue-100 text-sm font-medium truncate mt-1 opacity-90">{user.email}</p>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
              
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                
                if (item.external) {
                    return (
                        <Link
                            key={item.id}
                            href={item.href || '#'}
                            className="flex items-center justify-between p-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-gray-100 text-gray-500 rounded-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </div>
                        </Link>
                    )
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm'}`}>
                          {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight size={16} className="text-blue-500" />}
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 mt-2 border-t border-gray-50">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 p-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:shadow-inner transition-all duration-200"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>

        {/* MAIN CONTENT */}
        <main className="col-span-12 lg:col-span-9">
            <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm min-h-[500px]">
                {renderContent()}
            </div>
        </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const StatsCard = ({ icon, label, value, color }: any) => {
    const colorClasses: any = {
        blue: "bg-blue-50 text-blue-600",
        yellow: "bg-yellow-50 text-yellow-600",
        green: "bg-green-50 text-green-600"
    }
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
           <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
               {icon}
           </div>
           <div>
               <p className="text-sm text-gray-500 font-medium h-5">{label}</p>
               <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
           </div>
      </div>
    )
}

const OrderSummaryItem = ({ order }: any) => {
    const isContactLens = order.productType === 'ContactLens';
    const image = isContactLens ? order.contactLensDetails?.images?.[0] : order.frameDetails?.images?.[0];
    const name = isContactLens ? order.contactLensDetails?.name : order.frameDetails?.brandName + ' ' + (order.frameDetails?.modelNumber || '');

    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-sm flex-shrink-0">
                <Image 
                  src={image || "/placeholder.png"} 
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
            <div className="text-right hidden sm:block">
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
    )
}

const EmptyState = () => (
    <div className="text-center py-12 flex flex-col items-center">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
            <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <p className="text-gray-500 mb-4">Nothing to see here yet.</p>
        <Link href="/products" className="text-blue-600 font-semibold hover:underline">Start Shopping</Link>
    </div>
)
