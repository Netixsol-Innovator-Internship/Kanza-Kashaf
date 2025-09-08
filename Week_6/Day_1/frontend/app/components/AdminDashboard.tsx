"use client";

import React, { useEffect, useState } from "react";
import {
  useGetAdminStatsQuery,
  useGetAdminSalesQuery,
  useGetAdminBestSellersQuery,
  useGetAdminRecentOrdersQuery,
} from "../../store/api";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getSocket } from "../../lib/socket";

export default function AdminDashboard() {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("monthly");

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } =
    useGetAdminStatsQuery();
  const { data: sales, isLoading: salesLoading, refetch: refetchSales } =
    useGetAdminSalesQuery({ range });
  const { data: bestSellers, isLoading: bestLoading, refetch: refetchBest } =
    useGetAdminBestSellersQuery(3);
  const { data: recentOrders, isLoading: recentLoading, refetch: refetchRecent } =
    useGetAdminRecentOrdersQuery(6);

  // ✅ Realtime updates via shared socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const refreshOrders = () => {
      refetchStats();
      refetchSales();
      refetchBest();
      refetchRecent();
    };

    socket.on("order-created", refreshOrders);
    socket.on("order-updated", refreshOrders);

    socket.on("product-updated", () => {
      refetchBest();
      refetchSales();
    });

    socket.on("review-added", () => {
      refetchBest();
    });

    return () => {
      socket.off("order-created", refreshOrders);
      socket.off("order-updated", refreshOrders);
      socket.off("product-updated");
      socket.off("review-added");
    };
  }, [refetchStats, refetchSales, refetchBest, refetchRecent]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <div className="mb-6 text-sm text-gray-500">
            <Link href="/">
              <span className="hover:underline cursor-pointer">Home</span> &gt;{" "}
              <span className="font-medium text-gray-700">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? "—"}
          loading={statsLoading}
        />
        <StatCard
          title="Active Orders"
          value={stats?.activeOrders ?? "—"}
          loading={statsLoading}
        />
        <StatCard
          title="Completed Orders"
          value={stats?.completedOrders ?? "—"}
          loading={statsLoading}
        />
        <StatCard
          title="Returned Orders"
          value={stats?.returnedOrders ?? "—"}
          loading={statsLoading}
        />
      </div>

      {/* Sales graph + Best sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white border rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Sales Graph</h2>
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1 rounded ${
                  range === "daily" ? "bg-black text-white" : "bg-gray-100"
                }`}
                onClick={() => setRange("daily")}
              >
                Daily
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  range === "weekly" ? "bg-black text-white" : "bg-gray-100"
                }`}
                onClick={() => setRange("weekly")}
              >
                Weekly
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  range === "monthly" ? "bg-black text-white" : "bg-gray-100"
                }`}
                onClick={() => setRange("monthly")}
              >
                Monthly
              </button>
            </div>
          </div>

          <div style={{ height: 320 }}>
            {salesLoading ? (
              <div>Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sales || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#000"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white border rounded p-4">
          <h3 className="text-lg font-semibold mb-3">Best Sellers</h3>
          {bestLoading ? (
            <div>Loading...</div>
          ) : (
            <ul className="space-y-3">
              {(bestSellers || []).map((b: any, idx: number) => (
                <li
                  key={String(b.productId) || idx}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{b.name || "Unknown"}</div>
                    <div className="text-sm text-gray-500">
                      {b.qtySold ?? 0} sales
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">PKR {b.revenue || 0}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        {recentLoading ? (
          <div>Loading...</div>
        ) : (
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
                {(recentOrders || []).map((o: any) => (
                  <tr key={o._id} className="border-t">
                    <td className="py-2">
                      {(o.items || []).slice(0, 2).map((it: any) => (
                        <div key={it._id} className="text-sm">
                          {it.product?.name || it.name} x {it.quantity}
                        </div>
                      ))}
                      {o.items && o.items.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{o.items.length - 2} more
                        </div>
                      )}
                    </td>
                    <td className="py-2">{o._id}</td>
                    <td className="py-2">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2">{o.user?.name || o.user?.email}</td>
                    <td className="py-2">
                      {o.completed ? (
                        <span className="text-green-600">Completed</span>
                      ) : (
                        <span className="text-yellow-600">Active</span>
                      )}
                    </td>
                    <td className="py-2 text-right">PKR {o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  loading = false,
}: {
  title: string;
  value: any;
  loading?: boolean;
}) {
  return (
    <div className="bg-white border rounded p-4 flex flex-col">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">
        {loading ? "..." : value ?? "—"}
      </div>
    </div>
  );
}
