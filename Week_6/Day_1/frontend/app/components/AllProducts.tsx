"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGetProductsQuery } from "../../store/api";
import { getSocket } from "../../lib/socket";

export default function AllProducts({ category = "" }: { category?: string }) {
  const [page, setPage] = useState(1);
  const limit = 9; // Show 9 products per page

  // ✅ Reset to first page when category changes
  useEffect(() => {
    setPage(1);
  }, [category]);

  const { data, isLoading, refetch } = useGetProductsQuery({
    page,
    limit,
    category: category || undefined,
  });

  const products = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // ✅ Realtime refresh via socket
  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const refresh = () => refetch();

    const events = [
      "product-created",
      "product-deleted",
      "sale-started",
      "sale-ended",
      "product-updated",
    ];

    events.forEach((ev) => s.on(ev, refresh));

    return () => {
      events.forEach((ev) => s.off(ev, refresh));
    };
  }, [refetch]);

  // ✅ Format breadcrumb label (capitalize category if exists)
  const breadcrumb = category ? (
    `Home > All Products > ${
      category.charAt(0).toUpperCase() + category.slice(1)
    }`
  ) : (
    <div className="mb-6 text-sm text-gray-500">
      <Link href="/">
        <span className="hover:underline cursor-pointer">Home</span>{" "}
        &gt; <span className="font-medium text-gray-700">Sale Campaigns</span>
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Heading + Breadcrumb + Buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-gray-500 text-sm">{breadcrumb}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/profile/products/add"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Add New Product
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div>Loading products...</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p: any) => {
            const img = p?.variants?.[0]?.images?.[0] || "/placeholder.png";
            const ratingAvg = p.ratingAvg || 0;
            const ratingCount = p.ratingCount || 0;
            const salePercent = p.salePercent || 0;
            const salePrice = p.salePrice ?? p.regularPrice;

            return (
              <div key={p._id} className="bg-white border rounded p-4">
                <Link href={`/profile/products/${p._id}`}>
                  <div className="h-56 overflow-hidden rounded-md mb-3">
                    <img
                      src={img}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="font-medium text-lg mb-1 truncate">{p.name}</div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          color: i < Math.round(ratingAvg) ? "#f59e0b" : "#ddd",
                        }}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-xs">
                      {ratingAvg} ({ratingCount})
                    </span>
                  </div>
                </div>

                {/* ✅ Updated Price Rendering */}
                <div className="text-lg font-semibold">
                  {p.paymentType === "points" ? (
                    <span className="text-blue-600">
                      Points {p.pointsPrice || 0}
                    </span>
                  ) : p.paymentType === "hybrid" ? (
                    <div>
                      {salePercent && salePercent > 0 ? (
                        <div>
                          <span className="mr-2">PKR {salePrice}</span>
                          <span className="line-through text-sm text-gray-500">
                            PKR {p.regularPrice}
                          </span>
                        </div>
                      ) : (
                        <div>PKR {p.regularPrice}</div>
                      )}
                      {p?.pointsPrice != null && (
                        <div className="text-sm text-gray-600">
                          Points {p.pointsPrice}
                        </div>
                      )}
                    </div>
                  ) : salePercent && salePercent > 0 ? (
                    <div>
                      <span className="mr-2">PKR {salePrice}</span>
                      <span className="line-through text-sm text-gray-500">
                        PKR {p.regularPrice}
                      </span>
                    </div>
                  ) : (
                    <span>PKR {p.regularPrice}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
