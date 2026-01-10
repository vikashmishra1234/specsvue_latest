"use client";

import Image from "next/image";
import Swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";
import { 
    Package, 
    Truck, 
    CheckCircle2, 
    XCircle, 
    CreditCard, 
    Calendar,
    MapPin,
    Phone,
    MoreVertical,
    AlertCircle
} from "lucide-react";

interface ShowOrdersProps {
  isAdmin: boolean;
  order: any;
  isCancell?: boolean;
}

export default function ShowOrders({ isAdmin, order, isCancell }: ShowOrdersProps) {
  const [orderData, setOrderData] = useState(order);
  const [loading, setLoading] = useState(false);

  const { frameDetails: frame, contactLensDetails: lens, productType } = orderData;
  const status = orderData.orderStatus;
  const isPaid = orderData.paymentStatus === "paid";

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "shipped":
        return { color: "text-amber-700 bg-amber-50 border-amber-200", icon: Truck, label: "Shipped" };
      case "delivered":
        return { color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2, label: "Delivered" };
      case "cancelled":
        return { color: "text-rose-700 bg-rose-50 border-rose-200", icon: XCircle, label: "Cancelled" };
      case "Requested Cancellation":
        return { color: "text-orange-700 bg-orange-50 border-orange-200", icon: AlertCircle, label: "Cancel Requested" };
      default:
        return { color: "text-blue-700 bg-blue-50 border-blue-200", icon: Package, label: "Processing" };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  const handleStatusChange = async (newStatus: string, showConfirm = false) => {
    if (showConfirm) {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: newStatus === 'Requested Cancellation' ? "Do you want to request cancellation for this order?" : "Do you want to cancel this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Confirm",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
      if (!confirm.isConfirmed) return;
    }

    try {
      setLoading(true);
      const res = await axios.put("/api/update-order-status", {
        orderId: orderData._id,
        orderStatus: newStatus,
      });

      if (res.data.success) {
        setOrderData({ ...orderData, orderStatus: newStatus });
        Swal.fire({
            title: "Success", 
            text: newStatus === 'Requested Cancellation' ? "Cancellation requested successfully" : "Order status updated", 
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update order status", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      
      {/* Header Bar */}
      <div className="bg-gray-50/50 p-4 sm:p-6 sm:pb-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1">
              <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-bold text-lg">#{orderData.orderId}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 border ${statusConfig.color}`}>
                      <StatusIcon size={14} />
                      {statusConfig.label}
                  </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(orderData.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                       Txn: <span className="font-mono text-xs">{orderData.transactionId?.slice(0, 10)}...</span>
                  </span>
              </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1">
              <div className="text-2xl font-bold text-gray-900">₹{orderData.totalAmount.toLocaleString()}</div>
              
              <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md w-fit ${isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  <CreditCard size={12} />
                  {isPaid ? "Payment Successful" : "Payment Pending"}
              </div>
          </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-4">
              <div className="flex gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-xl p-2 border border-gray-100">
                      <Image
                        src={productType === 'ContactLens' ? (lens?.images?.[0] || "/no-image.png") : (frame?.images?.[0] || "/no-image.png")}
                        alt={productType === 'ContactLens' ? (lens?.name || "Lens") : (frame?.brandName || "Frame")}
                        width={128}
                        height={128}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                      {productType === 'ContactLens' ? (
                          <div className="space-y-2">
                              <h3 className="font-bold text-gray-900 text-lg sm:text-xl truncate" title={lens?.name}>{lens?.name}</h3>
                              <p className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded inline-block">{lens?.lensType}</p>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-xs sm:text-sm text-gray-500">
                                  {lens?.power && <div className="bg-gray-50 p-1.5 rounded">PWR: <span className="font-semibold text-gray-900">{lens?.power}</span></div>}
                                  {lens?.cylinder && <div className="bg-gray-50 p-1.5 rounded">CYL: <span className="font-semibold text-gray-900">{lens?.cylinder}</span></div>}
                                  {lens?.axis && <div className="bg-gray-50 p-1.5 rounded">AXIS: <span className="font-semibold text-gray-900">{lens?.axis}</span></div>}
                                  {lens?.color && <div className="bg-gray-50 p-1.5 rounded">Color: <span className="font-semibold text-gray-900">{lens?.color}</span></div>}
                              </div>
                          </div>
                      ) : (
                          <div className="space-y-1">
                              <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{frame?.brandName} <span className="text-gray-500 font-normal text-base">| {frame?.modelNumber}</span></h3>
                              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                                  <span>{frame?.frameType}</span>
                                  <span>•</span>
                                  <span>{frame?.frameShape}</span>
                                  <span>•</span>
                                  <span>{frame?.frameMaterial}</span>
                              </div>
                              <p className="text-sm text-gray-500">Color: <span className="text-gray-900 font-medium">{frame?.frameColor}</span></p>

                              {(orderData.lensName) && (
                                  <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-sm">
                                      <p className="font-semibold text-blue-900 mb-1 flex items-center gap-1.5">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                          Lens Details
                                      </p>
                                      <p className="text-blue-800">{orderData.lensName}</p>
                                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-blue-700/80 text-xs">
                                          {orderData.lensMaterial && <span>{orderData.lensMaterial}</span>}
                                          {orderData.lensCoating && <span>{orderData.lensCoating}</span>}
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}
                      <div className="mt-3 text-sm text-gray-500">
                        Qty: <span className="font-semibold text-gray-900">{orderData.quantity}</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Delivery & Actions */}
          <div className="flex flex-col justify-between gap-6 border-l-0 lg:border-l border-gray-100 lg:pl-6">
               <div className="space-y-3">
                   <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                       <MapPin size={16} className="text-gray-400" /> 
                       Delivery Address
                   </h4>
                   <div className="ml-6 text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                       <p className="font-semibold text-gray-900 mb-1">{orderData.address?.name}</p>
                       <p>{orderData.address?.houseNumberOrBuildingName}, {orderData.address?.areaOrLocality}</p>
                       <p>{orderData.address?.landmark && `${orderData.address.landmark}, `}{orderData.address?.city} - {orderData.address?.pincode}</p>
                       <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 text-gray-500">
                           <Phone size={14} /> 
                           <span>{orderData.address?.phone}</span>
                       </div>
                   </div>
               </div>

               {/* Action Buttons */}
               <div className="pt-4 border-t border-gray-100">
                    {isAdmin ? (
                        <div className="flex flex-col gap-2">
                             {status === "Requested Cancellation" && (
                                <button
                                    disabled={loading}
                                    onClick={() => handleStatusChange("cancelled", true)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    {loading ? "Processing..." : "Approve Cancellation"}
                                </button>
                             )}
                             <select
                                disabled={loading || status === "cancelled"}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className={`w-full border-gray-200 rounded-lg py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 bg-white ${status === "cancelled" ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:border-blue-400 cursor-pointer"}`}
                                defaultValue=""
                              >
                                <option value="" disabled>Update Status</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                        </div>
                    ) : (
                        <>
                             {status !== "cancelled" && status !== "delivered" && !isCancell && status !== "Requested Cancellation" && (
                                <button
                                    disabled={loading}
                                    onClick={() => handleStatusChange('Requested Cancellation', true)}
                                    className="w-full group border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? "Processing..." : "Cancel Order"} 
                                </button>
                             )}
                             {status === "Requested Cancellation" && (
                                 <div className="bg-orange-50 text-orange-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border border-orange-100">
                                     <AlertCircle size={16} /> Cancellation Requested
                                 </div>
                             )}
                        </>
                    )}
               </div>
          </div>
      </div>
    </div>
  );
}
