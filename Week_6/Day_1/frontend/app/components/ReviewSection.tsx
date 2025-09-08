"use client";

import React, { useEffect, useState } from "react";
import { useGetProductReviewsQuery, useAddReviewMutation } from "../../store/api";
import { useRouter } from "next/navigation";

export default function ReviewSection({ productId }: { productId: string }) {
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [reviews, setReviews] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const { data, isLoading, refetch } = useGetProductReviewsQuery({ id: productId, page, limit, sort });
  const [addReview] = useAddReviewMutation();

  useEffect(() => {
    if (!data) return;
    if (page === 1) {
      setReviews(data.items || []);
    } else {
      setReviews((p) => [...p, ...(data.items || [])]);
    }
    setTotal(data.total || 0);
  }, [data]);

  const [writing, setWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const router = useRouter();

  const handleWrite = async () => {
    try {
      await addReview({ id: productId, body: { rating, comment } }).unwrap();
      setComment("");
      setWriting(false);
      setPage(1);
      await refetch();
    } catch (e: any) {
    }
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">All Reviews ({total})</h3>
        </div>
        <div className="flex items-center gap-3">
          <select value={sort} onChange={(e) => { setSort(e.target.value as any); setPage(1); }} className="border p-1 rounded">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button onClick={() => setWriting((w) => !w)} className="px-3 py-1 border rounded">
            Write a Review
          </button>
        </div>
      </div>

      {writing && (
        <div className="mb-4 border rounded p-4">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm">Rating:</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-1 rounded">
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review" className="w-full border rounded p-2 mb-2" />
          <div className="flex gap-2">
            <button onClick={handleWrite} className="px-3 py-1 bg-black text-white rounded hover:bg-gray-700">Submit</button>
            <button onClick={() => setWriting(false)} className="px-3 py-1 border rounded">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div key={r._id || Math.random()} className="border rounded p-3">
            <div className="text-sm mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < r.rating ? "#f59e0b" : "#ddd" }}>★</span>
              ))}
            </div>
            <div className="font-medium">{r.user?.name || 'Anonymous'}</div>
            <div className="text-sm text-gray-700 mt-1">{r.comment}</div>
            <div className="text-xs text-gray-500 mt-2">{new Date(r.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        {reviews.length < (total || 0) && (
          <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border rounded">Load More Reviews</button>
        )}
      </div>
    </section>
  );
}
