"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useGetAllReviewsQuery } from "../../store/api";
import { getSocket } from "../../lib/socket";

type ReviewUser = { _id?: string; name?: string };
type ReviewItem = {
  _id: string;
  rating: number;
  comment?: string;
  user?: ReviewUser;
  createdAt?: string;
};

export default function Reviews() {
  const { data, isLoading, isFetching, refetch } = useGetAllReviewsQuery();

  const [items, setItems] = useState<ReviewItem[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);
  const [pageIndex, setPageIndex] = useState<number>(0);

  // responsive columns
  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w < 768) setItemsPerPage(1);
      else if (w < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // sort & set reviews
  useEffect(() => {
    const list = (data && Array.isArray((data as any).items)) ? (data as any).items : Array.isArray(data) ? (data as any) : [];
    if (list.length) {
      const sorted = [...list].sort((a, b) => {
        if (b.rating === a.rating) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return b.rating - a.rating;
      });
      setItems(sorted);
      setPageIndex(0);
    } else {
      setItems([]);
    }
  }, [data]);

  // ✅ realtime: refresh when any review is added anywhere
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const refreshTop = () => { refetch(); };
    const anyHandler = (evt: string, payload: any) => {
      if (evt && typeof evt === 'string' && evt.startsWith('review-added')) {
        refreshTop();
      }
    };
    // @ts-ignore onAny exists on v4
    socket.onAny(anyHandler);

    return () => {
      // @ts-ignore offAny exists on v4
      socket.offAny?.(anyHandler);
    };
  }, []);

  const pages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const visibleItems = useMemo(() => {
    const start = pageIndex * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, pageIndex, itemsPerPage]);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="text-sm mr-0.5">
        <span
          style={{ color: i < Math.round(rating) ? "#FBBF24" : "#E5E7EB" }}
        >
          ★
        </span>
      </span>
    ));

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-extrabold mb-6">OUR HAPPY CUSTOMERS</h2>
        <div className="text-center">Loading reviews...</div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight">
          OUR HAPPY CUSTOMERS
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
            className="w-8 h-8 rounded-full border disabled:opacity-40 flex items-center justify-center"
          >
            ←
          </button>
          <button
            onClick={() => setPageIndex((p) => Math.min(pages - 1, p + 1))}
            disabled={pageIndex >= pages - 1}
            className="w-8 h-8 rounded-full border disabled:opacity-40 flex items-center justify-center"
          >
            →
          </button>
        </div>
      </div>

      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
        }}
      >
        {visibleItems.map((r) => {
          const name = r.user?.name || "Anonymous";
          return (
            <article
              key={r._id}
              className="rounded-xl border bg-white p-6 shadow-sm min-h-[180px]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm">{renderStars(r.rating)}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="font-semibold text-sm">{name}</div>
              </div>

              <blockquote className="mt-3 text-sm text-gray-600 italic">
                {r.comment ? (
                  <span>&ldquo;{r.comment}&rdquo;</span>
                ) : (
                  <span className="text-gray-400">No comment provided.</span>
                )}
              </blockquote>

              <div className="mt-4 text-xs text-gray-400">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString()
                  : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPageIndex(i)}
            className={`w-2 h-2 rounded-full ${
              i === pageIndex ? "bg-gray-800" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {isFetching && (
        <div className="mt-4 text-sm text-center text-gray-500">
          Refreshing...
        </div>
      )}
    </section>
  );
}
