"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetProfileQuery, useGetOrderHistoryQuery } from "../../store/api";
import PersonalInfo from "../components/PersonalInfo";
import OrderHistory from "../components/OrderHistory";
import Settings from "../components/Settings";
import AdminOrdersList from "../components/AdminOrdersList";
import AdminDashboard from "../components/AdminDashboard";
import AllProducts from "../components/AllProducts";
import SaleCampaignsPage from "./sales/page";
import SuperAdminManageAdmins from "../components/SuperAdminManageAdmins";
import SuperAdminManageUsers from "../components/SuperAdminManageUsers";

const CATEGORIES = [
  { value: "t-shirts", label: "T-shirts" },
  { value: "shorts", label: "Shorts" },
  { value: "shirts", label: "Shirts" },
  { value: "hoodie", label: "Hoodie" },
  { value: "jeans", label: "Jeans" },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: user, isLoading } = useGetProfileQuery();
  const { data: orders, isLoading: ordersLoading } = useGetOrderHistoryQuery();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "orders" | "products" | "settings" | "sales" | "manageAdmins" | "manageUsers"
  >("dashboard");
  const [selectedCategory, setSelectedCategory] = useState("");

  const role = (user?.role || "").toString().toLowerCase();

  const isOrderDetailPage = !!pathname && pathname.startsWith("/profile/orders/");
  const isProductDetailPage = !!pathname && pathname.startsWith("/profile/products/");
  const isProductAddPage = !!pathname && pathname.startsWith("/profile/products/add");
  const isSalePage = !!pathname && pathname.startsWith("/profile/sales");
  const isAdminOrderDetailPage = !!pathname && pathname.startsWith("/profile/admin/orders/");

  useEffect(() => {
    if (!pathname) return;

    if (pathname === "/profile" || pathname === "/profile/") {
      setActiveTab("dashboard");
    } else if (pathname.startsWith("/profile/orders") || pathname.startsWith("/profile/admin/orders")) {
      setActiveTab("orders");
    } else if (pathname === "/profile/settings") {
      setActiveTab("settings");
    } else if (pathname.startsWith("/profile/products")) {
      setActiveTab("products");
    } else if (pathname.startsWith("/profile/sales")) {
      setActiveTab("sales");
    }
  }, [pathname]);

  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (isOrderDetailPage || isProductDetailPage || isProductAddPage || isSalePage || isAdminOrderDetailPage) {
      router.push("/profile");
    }
  };

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (!user) return <div className="p-10">No user found.</div>;

  return (
    <div className="flex max-w-[1440px] mx-auto bg-white min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 p-6">
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleTabClick("dashboard")}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeTab === "dashboard"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Dashboard
            </button>
          </li>

          {role === "user" && (
            <li>
              <button
                onClick={() => handleTabClick("orders")}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "orders"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Order History
              </button>
            </li>
          )}

          {role !== "user" && (
            <>
              <li>
                <button
                  onClick={() => handleTabClick("products")}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === "products"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  All Products
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleTabClick("orders")}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === "orders"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Order List
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleTabClick("sales")}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === "sales"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Sale Campaigns
                </button>
              </li>

              {role === "super_admin" && (
                <>
                  <li>
                    <button
                      onClick={() => handleTabClick("manageAdmins")}
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        activeTab === "manageAdmins"
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Manage Admins
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleTabClick("manageUsers")}
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        activeTab === "manageUsers"
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Manage Users
                    </button>
                  </li>
                </>
              )}

              <li>
                <div className="px-3 py-2">
                  <label className="block text-gray-600 mb-2">Categories</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            </>
          )}

          <li>
            <button
              onClick={() => handleTabClick("settings")}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeTab === "settings"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Settings
            </button>
          </li>
        </ul>
      </aside>

      {/* Content area */}
      <main className="flex-1 p-8">
        {isOrderDetailPage || isProductDetailPage || isProductAddPage || isSalePage || isAdminOrderDetailPage ? (
          children
        ) : (
          <>
            {activeTab === "dashboard" &&
              (role === "user" ? (
                <PersonalInfo user={user} />
              ) : (
                <AdminDashboard />
              ))}

            {activeTab === "orders" &&
              (role === "user" ? (
                ordersLoading ? (
                  <div>Loading orders...</div>
                ) : (
                  <OrderHistory orders={orders || []} />
                )
              ) : (
                <AdminOrdersList />
              ))}

            {activeTab === "products" && role !== "user" && (
              <AllProducts category={selectedCategory} />
            )}

            {activeTab === "sales" && role !== "user" && <SaleCampaignsPage />}

            {activeTab === "manageAdmins" && role === "super_admin" && (
              <SuperAdminManageAdmins />
            )}

            {activeTab === "manageUsers" && role === "super_admin" && (
              <SuperAdminManageUsers />
            )}

            {activeTab === "settings" && (
              <div className="space-y-10">
                {role !== "user" && <PersonalInfo user={user} />}
                <Settings user={user} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
