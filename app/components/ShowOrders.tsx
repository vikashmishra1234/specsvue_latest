"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

interface ShowOrdersProps {
  isAdmin: boolean;
  order: any;
  isCancell?: boolean; // Optional prop to indicate if the order is cancelled
}

const ShowOrders: React.FC<ShowOrdersProps> = ({ isAdmin, order,isCancell }) => {
  const [orderData, setOrderData] = useState(order); // ✅ You already have the full order
  const [orderStatus, setOrderStatus] = useState(order?.orderStatus);
  // if(!isAdmin) return alert("Please Pass the isAdmin Value")
  console.log("Order Data:", orderData);
  if (!orderData) return null;
  const handleChangeStatus = async (orderStatus: string, orderId: string) => {
    const res = await axios.put("/api/update-order-status", {
      orderStatus,
      orderId,
    });
  
    if (res?.data?.success) {
      Swal.fire({
        title: "Success",
        text: res.data.message,
        icon: "success",
      });
      setOrderStatus(orderStatus);
    }
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Order Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Order ID:
              </span>
              <span className="text-sm font-mono text-gray-900">
                {orderData._id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Placed:</span>
              <span className="text-sm text-gray-900">
                {new Date(orderData.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {orderStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <select
                  onChange={(e) =>
                    handleChangeStatus(e.target.value, orderData._id)
                  } // 👈 run function on change
                  defaultValue="Change Status" // optional: placeholder
                  className="border p-2 rounded"
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              ):<div>
                {!isCancell&&<button className="border border-solid px-[21px] py-[3px] text-[13px] rounded-md my-2 cursor-pointer" onClick={()=>handleChangeStatus('cancelled',orderData._id)}>Cancel</button>}
                </div>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Payment:
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  orderData.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {orderData.paymentStatus}
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              ₹{orderData.totalAmount}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Order Items
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderData.items.map((item: any, itemIndex: any) => {
            const product = item.productId;

            return (
              <div
                key={product._id || itemIndex}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors duration-200"
              >
                <div className="flex justify-center mb-3">
                  {product?.images?.[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product?.brandName}
                      width={80}
                      height={80}
                      className="object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {product?.brandName}
                  </h4>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Frame:</span>{" "}
                      {product.frameType}
                    </p>
                    <p>
                      <span className="font-medium">Prescription:</span>{" "}
                      {product.prescriptionType}
                    </p>
                    {item.lensName && (
                      <p>
                        <span className="font-medium">Lens:</span>{" "}
                        {item.lensName}
                      </p>
                    )}
                    {item.lensCoating && (
                      <p>
                        <span className="font-medium">Coating:</span>{" "}
                        {item.lensCoating}
                      </p>
                    )}
                    {item.lensMaterial && (
                      <p>
                        <span className="font-medium">Material:</span>{" "}
                        {item.lensMaterial}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Quantity:</span>{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <Link
                    href={`/product/${product._id}`}
                    className="inline-block text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                  >
                    View Product →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Shipping Address
        </h3>
        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="font-medium text-gray-900">{orderData.address.name}</p>
          <p>
            {orderData.address.houseNumberOrBuildingName},{" "}
            {orderData.address.areaOrLocality}
            {orderData.address.landmark && `, ${orderData.address.landmark}`}
          </p>
          <p>PIN: {orderData.address.pincode}</p>
          <p>Phone: {orderData.address.phone}</p>
        </div>
        {isCancell&&<div className="font-sm text-red-800 font-semibold mt-3">Your Refund will be credited in 4-5 working days.</div>}
      </div>
    </div>
  );
};

export default ShowOrders;
