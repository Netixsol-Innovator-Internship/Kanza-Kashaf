"use client";
import React from "react";

export default function OrderDetails({
  order,
  showUserInfo,
}: {
  order: any;
  showUserInfo: boolean;
}) {
  if (!order) return <div className="text-center py-10">No order found</div>;

  return (
    <div className="w-full space-y-8">
      {/* Heading + Breadcrumb */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Order Details
        </h1>
        <div className="text-sm text-gray-500 mt-1">
          Home &gt; Order List &gt; Order Details
        </div>
      </div>

      {/* User Info */}
      {showUserInfo && (
        <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
          <h2 className="font-semibold text-lg mb-3">
            Order ID: {order._id}
          </h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Name: {order.user?.name}</p>
            <p>Email: {order.user?.email}</p>
            {order.address && (
              <p>
                Address: {order.address.addressLine1}, {order.address.city},{" "}
                {order.address.province}, {order.address.country}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
        <h2 className="font-semibold text-lg mb-3">Products</h2>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="py-2 px-2">Product Name</th>
                <th className="py-2 px-2 hidden sm:table-cell">Order ID</th>
                <th className="py-2 px-2 text-center">Quantity</th>
                <th className="py-2 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((it: any, i: number) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 px-2">
                    {it.product?.name || it.name}
                  </td>
                  <td className="py-2 px-2 hidden sm:table-cell">{order._id}</td>
                  <td className="py-2 px-2 text-center">{it.quantity}</td>
                  <td className="py-2 px-2 text-right">
                    PKR{" "}
                    {(it.unitPrice || it.product?.regularPrice || 0) *
                      it.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="mt-6 text-right space-y-1 text-sm text-gray-700">
          <p>Subtotal: PKR {order.subtotal}</p>
          {order.discount > 0 && <p>Discount: PKR {order.discount}</p>}
          {order.pointsUsed > 0 && (
            <p>Points Subtotal: {order.pointsUsed}</p>
          )}
          <p>Delivery Fee: PKR {order.deliveryFee}</p>
          <p className="font-semibold text-lg text-black">
            Total: PKR {order.total}
          </p>
          <p className="text-sm">Payment Method: {order.paymentMethod}</p>
        </div>
      </div>
    </div>
  );
}
