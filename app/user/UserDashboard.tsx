"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  Package, 
  ShoppingCart, 
  XCircle, 
  HelpCircle, 
  MapPin, 
  LogOut 
} from 'lucide-react';

// Define a type for the user prop for better type safety
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
    { name: 'My Orders', icon: <Package size={20} />, href: `/user/orders/${userId}` },
    { name: 'Shopping Cart', icon: <ShoppingCart size={20} />, href: `/cart` },
    { name: 'Cancelled Products', icon: <XCircle size={20} />, href: `/user/canceled-item/${userId}` },
    // { name: 'My Addresses', icon: <MapPin size={20} />, href: `/user/addresses/${userId}` },
    { name: 'Help & Support', icon: <HelpCircle size={20} />, href: `/user/help` },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' }); // Redirect to login page after sign out
  };

  return (
    <aside className="bg-white p-6 rounded-2xl shadow-sm w-full">
      {/* == User Profile Header == */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-gray-200">
        <img
          src={user.picture}
          alt="User profile picture"
          className="w-24 h-24 rounded-full object-cover ring-4 ring-offset-2 ring-gray-500"
        />
        <h2 className="mt-4 text-xl font-bold text-gray-900 truncate w-full">{user.name}</h2>
        <p className="text-gray-500 text-sm mt-1 truncate w-full">{user.email}</p>
      </div>

      {/* == Dashboard Navigation == */}
      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 w-full p-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-gray-600 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* == Logout Button == */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full p-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}