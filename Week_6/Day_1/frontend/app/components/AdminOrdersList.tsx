"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useGetAdminOrdersQuery } from "../../store/api";
import { getSocket } from "../../lib/socket";

export default function AdminOrdersList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetAdminOrdersQuery({ page, limit: 8 });

  // ✅ Realtime order updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const refresh = () => refetch();

    socket.on("order-created", refresh);
    socket.on("order-updated", refresh);

    return () => {
      socket.off("order-created", refresh);
      socket.off("order-updated", refresh);
    };
  }, [refetch]);

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order History</h1>
          <div className="mb-6 text-sm text-gray-500">
            <Link href="/">
              <span className="hover:underline cursor-pointer">Home</span> &gt;{" "}
              <span className="font-medium text-gray-700">Orders</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Orders List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr>
                <th className="py-2">Product(s)</th>
                <th className="py-2">Order ID</th>
                <th className="py-2">Date</th>
                <th className="py-2">Customer Name</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(data.orders || []).map((order: any) => (
                <tr
                  key={order._id}
                  className="border-t cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    (window.location.href = `/admin/orders/${order._id}`)
                  }
                >
                  <td className="py-2">
                    {(order.items || []).slice(0, 2).map((it: any) => (
                      <div key={it._id} className="text-sm">
                        {it.product?.name || it.name} x {it.quantity}
                      </div>
                    ))}
                    {order.items && order.items.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{order.items.length - 2} more
                      </div>
                    )}
                  </td>
                  <td className="py-2">{order._id}</td>
                  <td className="py-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2">
                    {order.user?.name || order.user?.email}
                  </td>
                  <td className="py-2">
                    {order.completed ? (
                      <span className="text-green-600">Completed</span>
                    ) : (
                      <span className="text-yellow-600">Active</span>
                    )}
                  </td>
                  <td className="py-2 text-right">PKR {order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {data.page} of {data.totalPages}
          </span>
          <button
            disabled={page === data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
