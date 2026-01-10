'use client'

import ShowOrders from '@/app/components/ShowOrders'
import React, { useState, useEffect } from 'react'
import { Search, Calendar, Filter, Loader2 } from 'lucide-react';
import getAllOrders from '@/actions/GetAllOrders';

interface OrderProps {
  initialOrders: any[];
}

const Orders: React.FC<OrderProps> = ({ initialOrders }) => {
    const [orders, setOrders] = useState<any[]>(initialOrders || []);
    const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');
    
    // Pagination State
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterMinPrice, setFilterMinPrice] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');

    // Function to fetch orders
    const fetchOrders = async (isLoadMore = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        const nextPage = isLoadMore ? page + 1 : 1;
        
        const params = {
            page: nextPage,
            limit: 5,
            search: searchQuery,
            date: filterDate,
            status: filterStatus,
            minPrice: filterMinPrice,
            maxPrice: filterMaxPrice,
            type: activeTab === 'requests' ? 'requests' : undefined
        };

        try {
            const res = await getAllOrders(params);
            
            if (res.success) {
                if (isLoadMore) {
                    setOrders(prev => [...prev, ...res.data]);
                    setPage(nextPage);
                } else {
                    setOrders(res.data);
                    setPage(1);
                }
                setHasMore(res.pagination?.hasMore || false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Trigger fetch on filter change or tab change
    useEffect(() => {
        // Debounce search could be added here, but for now simple effect
        const timeoutId = setTimeout(() => {
            fetchOrders(false);
        }, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [activeTab, searchQuery, filterDate, filterStatus, filterMinPrice, filterMaxPrice]);

    // Initial load is handled by props, but activeTab change triggers fetch.
    // However, initialOrders might not match current activeTab if user switches tabs.
    // We rely on the effect above to refetch correctly when tab changes.
    // NOTE: 'initialOrders' is used as initial state, but effect runs on mount?
    // If strict mode is on, effect runs twice. 
    // To avoid double fetching on mount if props are already good:
    // We can skip first run if we trust props. 
    // But filters are part of dependency. simpler to just let it fetch or manage "isMounted".
    
    return (
    <div className="max-w-6xl mx-auto py-8">
      
      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
          <button 
            className={`mr-6 pb-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders
          </button>
          <button 
            className={`pb-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'requests' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('requests')}
           >
             Cancellation Requests 
           </button>
      </div>

        {/* Filters Panel */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Search */}
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                    <input 
                        type="text" 
                        placeholder="Search ID, Product..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Date */}
                <div className="relative">
                     <Calendar className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                     <input 
                        type="date" 
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                 {/* Status */}
                 <div className="relative">
                     <Filter className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                     <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="Requested Cancellation">Requested Cancellation</option>
                    </select>
                 </div>

                 {/* Price Range */}
                 <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Min ₹" 
                        value={filterMinPrice}
                        onChange={(e) => setFilterMinPrice(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                     <input 
                        type="number" 
                        placeholder="Max ₹" 
                        value={filterMaxPrice}
                        onChange={(e) => setFilterMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
            </div>
            
            {(searchQuery || filterDate || filterStatus || filterMinPrice || filterMaxPrice) && (
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={() => {
                            setSearchQuery('');
                            setFilterDate('');
                            setFilterStatus('');
                            setFilterMinPrice('');
                            setFilterMaxPrice('');
                        }}
                        className="text-sm text-red-600 hover:underline"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>


      {loading ? (
           <div className="flex justify-center py-20">
               <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
           </div>
      ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
              <p className="text-gray-500 text-lg">No orders match your filters.</p>
          </div>
      ) : (
          <div className="space-y-6">
              {orders.map((order, index) => (
                <div key={order._id || index}>
                    <ShowOrders isAdmin={true} order={order} />
                </div>
              ))}
          </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && orders.length > 0 && (
          <div className="mt-8 flex justify-center">
              <button
                onClick={() => fetchOrders(true)}
                disabled={loadingMore}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 shadow-md transition-all"
              >
                  {loadingMore ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Loading...
                      </>
                  ) : (
                      "Load More Orders"
                  )}
              </button>
          </div>
      )}
    </div>
  );
};

export default Orders;
