"use client";

import React, { useState, useEffect } from "react";
import {
  useGetProductsQuery,
  useGetNewArrivalProductsQuery,
  useGetTopSellingQuery,
} from "../../store/api";
import FiltersSidebar from "./FiltersSidebar";
import ProductsGrid from "./ProductsGrid";
import Pagination from "./Pagination";
import { getSocket } from "../../lib/socket";

const DEFAULT_LIMIT = 9;

type Props = {
  mode: "all" | "new-arrivals" | "top-selling";
  title: string;
};

export default function ProductsPageWrapper({ mode, title }: Props) {
  const [filters, setFilters] = useState<any>({
    category: undefined,
    styles: [],
    colors: [],
    sizes: [],
    priceMin: undefined,
    priceMax: undefined,
    page: 1,
    limit: DEFAULT_LIMIT,
  });

  // choose API based on mode
  const queryHook =
    mode === "new-arrivals"
      ? useGetNewArrivalProductsQuery
      : mode === "top-selling"
      ? useGetTopSellingQuery
      : useGetProductsQuery;

  const { data, isLoading, refetch } = queryHook(filters);

  const items = data?.items || [];
  const total = data?.total || 0;
  const page = data?.page || filters.page;
  const limit = data?.limit || filters.limit;

  const onApplyFilters = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters, page: 1 }); // reset to first page
  };

  const onPageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Mobile filter button */}
        <div className="lg:hidden">
          <details className="mb-4">
            <summary className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer select-none">
              Filters
            </summary>
            <div className="mt-3 border rounded p-3">
              <FiltersSidebar current={filters} onApply={onApplyFilters} />
            </div>
          </details>
        </div>

        <aside className="hidden lg:block">
          <FiltersSidebar current={filters} onApply={onApplyFilters} />
        </aside>

        <main>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl lg:text-3xl font-semibold">{title}</h1>
            <div className="text-xs lg:text-sm text-gray-600">
              Showing {Math.min(total, page * limit) - (page - 1) * limit} of {total} products
            </div>
          </div>

          <ProductsGrid products={items} loading={isLoading} />

          <div className="mt-8">
            {!isLoading && total > limit && (
              <Pagination
                page={page}
                limit={limit}
                total={total}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
