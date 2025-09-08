"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function TopSelling({ showCount = 4 }: { showCount?: number }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [itemsPerPage, setItemsPerPage] = useState<number>(4);

  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      setItemsPerPage(w < 768 ? 2 : 4);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchTopSelling() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/top-selling?limit=15`
        );
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error("Failed to load top selling:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopSelling();
  }, []);

  const pages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [itemsPerPage, items.length]);

  const visibleItems = useMemo(() => {
    const start = pageIndex * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, pageIndex, itemsPerPage]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <section className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Top Selling</h2>

      <div className="relative">
        {/* Slider Controls */}
        <div className="flex items-center justify-between mb-4">
          <div />
          <div className="flex gap-2">
            <button
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={pageIndex === 0}
            >
              Prev
            </button>
            <button
              onClick={() => setPageIndex((p) => Math.min(pages - 1, p + 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={pageIndex >= pages - 1}
            >
              Next
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
          }}
        >
          {visibleItems.map((p: any) => {
            const img = p?.variants?.[0]?.images?.[0] || "/placeholder.png";
            const ratingAvg = p.ratingAvg || 0;
            const ratingCount = p.ratingCount || 0;
            const salePercent = p.salePercent || 0;
            const salePrice = p.salePrice ?? p.regularPrice;

            return (
              <div key={p._id} className="border rounded p-3 bg-white">
                <div className="h-40 flex items-center justify-center overflow-hidden">
                  <img
                    src={img}
                    alt={p.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mt-2">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="mr-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          style={{
                            color:
                              i < Math.round(ratingAvg) ? "#f59e0b" : "#ddd",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                    <span className="ml-2 text-xs">
                      {ratingAvg} ({ratingCount})
                    </span>
                  </div>

                  <div className="mt-2">
                    {p.paymentType === "points" ? (
                      <div className="font-semibold">
                        Points {p.pointsPrice || 0}
                      </div>
                    ) : p.paymentType === "hybrid" ? (
                      <div>
                        {salePercent && salePercent > 0 ? (
                          <div>
                            <span className="font-semibold mr-2">
                              PKR {salePrice}
                            </span>
                            <span className="line-through text-sm text-gray-500">
                              PKR {p.regularPrice}
                            </span>
                          </div>
                        ) : (
                          <div className="font-semibold">PKR {p.regularPrice}</div>
                        )}
                        {p?.pointsPrice != null && (
                          <div className="text-sm text-gray-600">Points {p.pointsPrice}</div>
                        )}
                      </div>
                    ) : salePercent && salePercent > 0 ? (
                      <div>
                        <span className="font-semibold mr-2">
                          PKR {salePrice}
                        </span>
                        <span className="line-through text-sm text-gray-500">
                          PKR {p.regularPrice}
                        </span>
                      </div>
                    ) : (
                      <div className="font-semibold">
                        PKR {p.regularPrice}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/products")}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
          >
            View All
          </button>
        </div>
      </div>
    </section>
  );
}
