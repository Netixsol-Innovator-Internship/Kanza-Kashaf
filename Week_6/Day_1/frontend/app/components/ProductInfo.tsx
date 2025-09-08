"use client";

import React from "react";

const colorMap: Record<string, string> = {
  green: "#10B981",
  red: "#EF4444",
  yellow: "#F59E0B",
  orange: "#F97316",
  blue: "#3B82F6",
  navy: "#1E3A8A",
  purple: "#8B5CF6",
  pink: "#EC4899",
  white: "#FFFFFF",
  black: "#111827",
};

export default function ProductInfo({
  product,
  selectedVariantIndex,
  onSelectVariant,
  selectedSizeIndex,
  onSelectSize,
  quantity,
  setQuantity,
  onAddToCart,
}: {
  product: any;
  selectedVariantIndex: number;
  onSelectVariant: (i: number) => void;
  selectedSizeIndex: number | null;
  onSelectSize: (i: number) => void;
  quantity: number;
  setQuantity: (n: number) => void;
  onAddToCart: () => Promise<void>;
}) {
  const variant = product?.variants?.[selectedVariantIndex] || null;
  const sizes = variant?.sizes || [];

  const ratingAvg = product?.ratingAvg || 0;
  const ratingCount = product?.ratingCount || 0;

  const salePercent = product?.salePercent || 0;
  const salePrice = product?.salePrice ?? product?.regularPrice;

  const paymentType = product?.paymentType;

  const selectedSizeStock =
    selectedSizeIndex !== null && sizes[selectedSizeIndex]
      ? sizes[selectedSizeIndex].stock || 0
      : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{product?.name}</h1>

      <div className="flex items-center gap-3">
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < Math.round(ratingAvg) ? "#f59e0b" : "#ddd" }}>★</span>
          ))}
        </div>
        <div className="text-sm text-gray-600">{ratingAvg} ({ratingCount})</div>
      </div>

      <div>
        {paymentType === "money" && (
          salePercent && salePercent > 0 ? (
            <div>
              <div className="text-2xl font-bold inline-block mr-3">PKR {salePrice}</div>
              <div className="text-sm text-gray-500 line-through inline-block mr-2">PKR {product.regularPrice}</div>
              <div className="text-sm inline-block text-red-600">-{salePercent}%</div>
            </div>
          ) : (
            <div className="text-2xl font-bold">PKR {product.regularPrice}</div>
          )
        )}

        {paymentType === "points" && product?.pointsPrice != null && (
          <div className="text-2xl font-bold text-indigo-600">Points {product.pointsPrice}</div>
        )}

        {paymentType === "hybrid" && (
          <div>
            {salePercent && salePercent > 0 ? (
              <div>
                <div className="text-2xl font-bold inline-block mr-3">PKR {salePrice}</div>
                <div className="text-sm text-gray-500 line-through inline-block mr-2">PKR {product.regularPrice}</div>
                <div className="text-sm inline-block text-red-600">-{salePercent}%</div>
              </div>
            ) : (
              <div className="text-2xl font-bold">PKR {product.regularPrice}</div>
            )}
            {product?.pointsPrice != null && (
              <div className="text-lg text-gray-700">Points {product.pointsPrice}</div>
            )}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-700">{product?.description}</div>

      {/* Colors */}
      <div>
        <div className="text-sm font-medium mb-2">Select Color</div>
        <div className="flex gap-3">
          {product?.variants?.map((v: any, idx: number) => (
            <button
              key={idx}
              onClick={() => onSelectVariant(idx)}
              className={`rounded-full flex items-center justify-center ${idx === selectedVariantIndex ? 'ring-2 ring-blue-500' : ''}`}
              title={v.color}
            >
              <span
                style={{
                  backgroundColor: colorMap[v.color] || '#eee',
                  display: 'block',
                  height: 20,
                  width: 20,
                  borderRadius: '50%',
                  border: v.color === 'white' ? '1px solid #ddd' : undefined,
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <div className="text-sm font-medium mb-2">Choose Size</div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s: any, idx: number) => {
            const disabled = (s.stock || 0) <= 0;
            return (
              <button
                key={idx}
                onClick={() => !disabled && onSelectSize(idx)}
                className={`px-3 py-1 border rounded ${selectedSizeIndex === idx ? 'bg-black text-white' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                disabled={disabled}
                title={`Stock: ${s.stock}`}
              >
                {s.size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1"
          >
            -
          </button>
          <div className="px-4">{quantity}</div>
          <button
            onClick={() => setQuantity(Math.min(selectedSizeStock || 9999, quantity + 1))}
            className="px-3 py-1"
          >
            +
          </button>
        </div>

        <button
          onClick={onAddToCart}
          className="px-5 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Add to Cart
        </button>
      </div>

      {/* stock hint */}
      <div className="text-sm text-gray-500">
        {selectedSizeIndex !== null ? (
          <span>Stock: {selectedSizeStock}</span>
        ) : (
          <span>Select size to see stock</span>
        )}
      </div>
    </div>
  );
}
