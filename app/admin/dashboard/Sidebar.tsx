"use client";
import React from "react";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Eye, 
  FileSliders, 
  Settings, 
  LogOut 
} from "lucide-react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

interface SidebarProps {
  showThis: number;
  setShowThis: (value: number) => void;
}

const Sidebar = ({ showThis, setShowThis }: SidebarProps) => {
  const menuItems = [
    { id: 0, label: "Overview", icon: LayoutDashboard },
    { id: 1, label: "Orders", icon: ShoppingCart },
    { id: 2, label: "Products", icon: Package },
    { id: 5, label: "Contact Lenses", icon: Eye },
    { id: 3, label: "Prescriptions", icon: FileSliders },
    { id: 4, label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    });

    if (result.isConfirmed) {
      Cookies.remove("adminToken");
      window.location.reload(); // Force reload to redirect to login if protected
      Swal.fire("Logged out!", "You have been logged out.", "success");
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-gray-900 text-white fixed left-0 top-0 bottom-0 z-50 shadow-xl">
      {/* Brand */}
      <div className="flex items-center justify-center h-20 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-wider">
          Specs<span className="text-blue-500">Vue</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = showThis === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setShowThis(item.id)}
              className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon
                className={`w-5 h-5 mr-3 transition-colors ${
                  isActive ? "text-white" : "text-gray-500 group-hover:text-white"
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
