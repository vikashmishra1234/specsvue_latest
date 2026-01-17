'use client';
import React, { useState } from 'react';
import Cookies from 'js-cookie'
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X, FileSliders, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  setShowThis: (value: number) => void;
}

const AdminHeader = ({ setShowThis }: HeaderProps) => {
  const [activeItem, setActiveItem] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 0, label: 'Dashboard', icon: LayoutDashboard },
    { id: 1, label: 'Orders', icon: ShoppingCart },
    { id: 2, label: 'Products', icon: Package },
    { id: 5, label: 'Contact Lenses', icon: Eye },
    { id: 3, label: 'Priscriptions', icon: FileSliders },
    { id: 4, label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: number) => {
    setActiveItem(id);
    setShowThis(id);
    setIsMobileMenuOpen(false);
  };

  const handleAdminLogout = async()=>{
      const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
    });

    if(result.isConfirmed){
      Cookies.remove("adminToken");
      Swal.fire('Logged out!', 'You have been successfully logged out.', 'success');
    }

  }

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 transition-all">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu & Title */}
          <div className="flex items-center gap-4">
             <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h2 className="text-xl font-bold text-gray-900 md:hidden">Admin Panel</h2>
            {/* Desktop Message/Title (Optional) */}
            <div className="hidden md:block">
               <span className="text-gray-500 text-sm">Dashboard Overview</span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
             {/* Add notifications or user profile here if needed later */}
             <div className="flex items-center gap-2">
                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-white shadow-sm">
                   AD
                 </div>
                 <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeItem === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
             <div className="h-px bg-gray-100 my-2"></div>
            <button 
                onClick={handleAdminLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
             >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
