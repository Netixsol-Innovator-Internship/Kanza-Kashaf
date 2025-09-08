'use client';

import React from 'react';
import Link from 'next/link';

export default function ProductsGrid({ products = [], loading = false }: any) {
  if (loading) return <div>Loading products...</div>;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p: any) => {
        const img = p?.variants?.[0]?.images?.[0] || '/placeholder.png';
        const ratingAvg = p.ratingAvg || 0;
        const ratingCount = p.ratingCount || 0;
        const salePercent = p.salePercent || 0;
        const salePrice = p.salePrice ?? p.regularPrice;

        return (
          <div key={p._id} className="bg-white border rounded p-4">
            <Link href={`/products/${p._id}`}>
              <div className="h-56 overflow-hidden rounded-md mb-3">
                <img src={img} alt={p.name} className="w-full h-full object-cover" />
              </div>
            </Link>

            <div className="font-medium text-lg mb-1 truncate">{p.name}</div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < Math.round(ratingAvg) ? '#f59e0b' : '#ddd' }}>★</span>
                ))}
                <span className="ml-2 text-xs">{ratingAvg} ({ratingCount})</span>
              </div>
            </div>

            {/* ✅ Updated Price Rendering */}
            <div className="text-lg font-semibold">
              {p.paymentType === 'points' ? (
                <span className="text-blue-600">Points {p.pointsPrice || 0}</span>
              ) : p.paymentType === 'hybrid' ? (
                <div>
                  {salePercent && salePercent > 0 ? (
                    <div>
                      <span className="mr-2">PKR {salePrice}</span>
                      <span className="line-through text-sm text-gray-500">PKR {p.regularPrice}</span>
                    </div>
                  ) : (
                    <div>PKR {p.regularPrice}</div>
                  )}
                  {p?.pointsPrice != null && (
                    <div className="text-sm text-gray-600">Points {p.pointsPrice}</div>
                  )}
                </div>
              ) : salePercent && salePercent > 0 ? (
                <div>
                  <span className="mr-2">PKR {salePrice}</span>
                  <span className="line-through text-sm text-gray-500">PKR {p.regularPrice}</span>
                </div>
              ) : (
                <span>PKR {p.regularPrice}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
