import ShowOrders from "@/app/components/ShowOrders";
import StatCard from "./StatCard";

interface OverviewProps {
  productsLength: number;
  users: number;
  orders: any[];
  totalOrders: number;
}

export default function Overview({ users, productsLength, orders, totalOrders }: OverviewProps) {
  // Optional: dynamic greeting
  const hours = new Date().getHours();
  const greeting =
    hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <section className="w-full py-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, <span className="text-blue-600">Rishabh</span> 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back to your <span className="font-medium text-gray-800">SpecsVue</span> dashboard.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-200">
           
            <p className="text-lg font-bold text-gray-800">SpecsVue</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon="📦"
            color="bg-blue-50"
          />
          <StatCard
            title="Products"
            value={productsLength}
            icon="🕶️"
            color="bg-green-50"
          />
          <StatCard
            title="Users"
            value={users}
            icon="👥"
            color="bg-purple-50"
          />
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            Recent Orders
            <span className="text-sm text-gray-500 font-normal">
              ({orders.length})
            </span>
          </h2>

          {orders.length > 0 ? (
            <div className="space-y-5">
              {orders.map((order, index) => (
                <ShowOrders isAdmin={true} key={index} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
