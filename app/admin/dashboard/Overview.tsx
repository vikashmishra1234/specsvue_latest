import Link from "next/link";
import StatCard from "./StatCard";
import { 
  ShoppingBag, 
  Users, 
  Layers, 
  ArrowRight, 
  Search, 
  Calendar,
  MoreHorizontal
} from "lucide-react";

interface OverviewProps {
  productsLength: number;
  users: number;
  orders: any[];
  totalOrders: number;
  onViewOrders: () => void;
  onAddProduct: () => void;
}

export default function Overview({ users, productsLength, orders, totalOrders, onViewOrders, onAddProduct }: OverviewProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="w-full min-h-screen bg-gray-50/50 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Calendar size={14} />
              {currentDate}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-all focus:ring-2 focus:ring-gray-200">
                Download Report
             </button>
             <button 
                onClick={onAddProduct}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all focus:ring-2 focus:ring-blue-500"
             >
                + Add Product
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={ShoppingBag}
            color="bg-blue-600"
            trend="up"
            trendValue="+12.5%"
          />
          <StatCard
            title="Active Products"
            value={productsLength}
            icon={Layers}
            color="bg-indigo-600"
            trend="up"
            trendValue="+4.2%"
          />
          <StatCard
            title="Total Customers"
            value={users}
            icon={Users}
            color="bg-purple-600"
            trend="up"
            trendValue="+8.1%"
          />
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <button 
                onClick={onViewOrders} 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
                View All Orders <ArrowRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-100">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order.orderId || order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                {order.address?.name?.charAt(0) || 'U'}
                            </div>
                            {order.address?.name || 'Guest User'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            order.orderStatus === "delivered"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : order.orderStatus === "cancelled"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : order.orderStatus === "shipped"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                          }`}
                        >
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                        No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
