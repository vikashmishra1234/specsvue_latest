"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  Package, 
  ShoppingCart, 
  XCircle, 
  HelpCircle, 
  LogOut,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import Image from 'next/image';

type User = {
  picture: string;
  name: string;
  email: string;
};

interface UserDashboardProps {
  user: User;
  userId: string;
}

export default function UserDashboard({ user, userId }: UserDashboardProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: <UserIcon size={18} />, href: `/user` },
    { name: 'My Orders', icon: <Package size={18} />, href: `/user/orders/${userId}` },
    { name: 'Shopping Cart', icon: <ShoppingCart size={18} />, href: `/cart` },
    { name: 'Cancelled Items', icon: <XCircle size={18} />, href: `/user/canceled-item/${userId}` },
    { name: 'Help & Support', icon: <HelpCircle size={18} />, href: `/user/help` },
  ];

  const handleLogout = async () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#3B82F6",
      confirmButtonText: "Yes, logout",
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl',
        title: 'font-bold text-gray-800'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await signOut({ callbackUrl: "/login" });
      }
    });
  };

  return (
    <aside className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden sticky top-20">
      
      {/* Profile Header */}
      <div className="relative pt-8 pb-6 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="absolute top-0 left-0 w-full h-24 bg-white/10 opacity-30 blur-2xl rounded-b-full"></div>
        
        <div className="relative inline-block mb-4">
             <div className="p-1 bg-white/20 backdrop-blur-sm rounded-full">
                <Image
                    src={user.picture}
                    alt={user.name}
                    width={88}
                    height={88}
                    className="rounded-full object-cover border-4 border-white shadow-md bg-white"
                />
             </div>
        </div>
        
        <h2 className="text-xl font-bold truncate tracking-tight">{user.name}</h2>
        <p className="text-blue-100 text-sm font-medium truncate mt-1 opacity-90">{user.email}</p>
        
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/20 backdrop-blur-md">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Active Member
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/user' && pathname === '/user');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
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
            </Link>
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
  );
}