'use client';
import React, { useState } from 'react';
import Cookies from 'js-cookie'
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X, FileSliders } from 'lucide-react';
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
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-22">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {/* <Link href="/" className="text-sm font-bold text-white">
            <Image src={'/images/site_logo.png'} className="w-[70px] md:w-unset" height={100} width={100} alt="Site Logo"/>
          </Link> */}
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeItem === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout (Desktop) */}
          <div className="hidden md:flex">
            <button onClick={handleAdminLogout} className="flex items-center cursor-pointer gap-2 text-gray-700 hover:text-red-600 transition-colors duration-200">
              <LogOut className="h-5 w-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md border border-gray-300"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeItem === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}

            <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200">
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
