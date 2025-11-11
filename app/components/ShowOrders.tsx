"use client";

import Image from "next/image";
import Swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";

interface ShowOrdersProps {
  isAdmin: boolean;
  order: any;
  isCancell?: boolean;
}

export default function ShowOrders({ isAdmin, order, isCancell }: ShowOrdersProps) {
  const [orderData, setOrderData] = useState(order);
  const [loading, setLoading] = useState(false);

  const frame = orderData.frameDetails;
  const status = orderData.orderStatus;
  const isPaid = orderData.paymentStatus === "paid";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shipped":
        return "text-yellow-700 bg-yellow-100";
      case "delivered":
        return "text-green-700 bg-green-100";
      case "cancelled":
        return "text-red-700 bg-red-100";
      default:
        return "text-blue-700 bg-blue-100";
    }
  };

  const handleStatusChange = async (newStatus: string, showConfirm = false) => {
    if (showConfirm) {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to cancel this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
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
        Swal.fire("Success", "Order status updated successfully", "success");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update order status", "error");
    } finally {
      setLoading(false);
    }
  };

  // const requestForCancellation = async(orderId:string)=>{
  //   sendCancellationMailToAdmin(orderId)
  // }

  return (
    <div className="border border-gray-300 rounded-2xl p-5 shadow-md bg-white mb-6">
      {/* Header */}
      <div className="flex justify-between flex-wrap gap-3 border-b pb-3 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            Order ID: <span className="font-mono">{orderData.orderId}</span>
          </h2>
          <p className="text-sm text-gray-600">
            Transaction: {orderData.transactionId}
          </p>
          <p className="text-sm text-gray-600">
            Ordered on:{" "}
            {new Date(orderData.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
          <p className="mt-1 text-sm">
            Payment:{" "}
            <span
              className={`font-semibold ${
                isPaid ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isPaid ? "Paid" : "Pending"}
            </span>
          </p>
          <p className="font-bold text-gray-900 mt-1 text-lg">
            ₹{orderData.totalAmount}
          </p>
        </div>
      </div>

      {/* Frame Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-50 w-full  flex justify-center">
          <Image
            src={frame?.images?.[0] || "/no-image.png"}
            alt={frame?.brandName || "Frame Image"}
            width={140}
            height={140}
            className="rounded-lg w-full object-cover border"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg mb-1">
            {frame?.brandName} – {frame?.modelNumber}
          </h3>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Frame Type:</span> {frame?.frameType}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Frame Shape:</span> {frame?.frameShape}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Material:</span>{" "}
            {frame?.frameMaterial}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Color:</span> {frame?.frameColor}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Prescription:</span>{" "}
            {frame?.prescriptionType}
          </p>

          {/* Lens */}
          <div className="mt-2 text-sm text-gray-700">
            {orderData.lensName && (
              <p>
                <span className="font-medium">Lens:</span> {orderData.lensName}
              </p>
            )}
            {orderData.lensMaterial && (
              <p>
                <span className="font-medium">Material:</span>{" "}
                {orderData.lensMaterial}
              </p>
            )}
            {orderData.lensCoating && (
              <p>
                <span className="font-medium">Coating:</span>{" "}
                {orderData.lensCoating}
              </p>
            )}
            <p>
              <span className="font-medium">Quantity:</span>{" "}
              {orderData.quantity}
            </p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="mt-5 border-t pt-3">
        <h4 className="font-semibold text-sm mb-1 text-gray-800">
          Delivery Address
        </h4>
        <p className="text-sm text-gray-700">
          {orderData.address?.name}, {orderData.address?.houseNumberOrBuildingName},{" "}
          {orderData.address?.areaOrLocality},{" "}
          {orderData.address?.landmark ? `${orderData.address.landmark}, ` : ""}
          {orderData.address?.pincode}
        </p>
        <p className="text-sm text-gray-700">
          Phone: {orderData.address?.phone}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
        {isAdmin ? (
          <select
            disabled={loading}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Change Status
            </option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        ) : (
          <>
            {status !== "cancelled" && !isCancell && (
              <button
                disabled={loading}
                onClick={() => handleStatusChange('Requested Cancellation',true)}
                className="border cursor-pointer border-red-500 text-red-600 text-sm px-4 py-2 rounded-md hover:bg-red-50"
              >
                {loading ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
