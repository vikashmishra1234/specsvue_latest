import ShowOrders from "@/app/components/ShowOrders";
import StatCard from "./StatCard";

interface OverviewProps {
  productsLength: number;
  users: number;
  orders: any[];
}

export default function Overview({ users, productsLength, orders }: OverviewProps) {
  return (
    <section className="w-full py-8 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your business metrics and recent orders</p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-6 mb-12">
          <StatCard title="Total Orders" value={orders.length} />
          <StatCard title="Products" value={productsLength} />
          <StatCard title="Users" value={users} />
        </div>

        {/* Orders Section */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
            {orders.map((order, index) => (
              <ShowOrders isAdmin={true} key={index} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No orders found</div>
          </div>
        )}
      </div>
    </section>
  );
}