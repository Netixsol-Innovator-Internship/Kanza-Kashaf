"use client";

import React from "react";

type Variant = {
  color: string;
  images: string[];
  sizes?: any[];
};

export default function ProductGallery({
  variant,
  selectedImage,
  onSelectImage,
}: {
  variant: Variant | null;
  selectedImage: number;
  onSelectImage: (idx: number) => void;
}) {
  if (!variant) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
        <img src="/placeholder.png" alt="placeholder" className="object-cover h-full" />
      </div>
    );
  }

  const images = variant.images || [];

  return (
    <div className="flex gap-4">
      {/* left thumbnails column (3 rows) */}
      <div className="hidden md:flex flex-col gap-3 w-16">
        {images.slice(0, 3).map((img: string, idx: number) => (
          <button
            key={idx}
            onClick={() => onSelectImage(idx)}
            className={`h-20 w-16 overflow-hidden rounded border ${selectedImage === idx ? 'ring-2 ring-blue-500' : ''}`}
          >
            <img src={img} alt={`thumb-${idx}`} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>

      {/* big image */}
      <div className="flex-1 h-96 bg-white rounded overflow-hidden border">
        <img
          src={images[selectedImage] || images[0] || "/placeholder.png"}
          alt="main"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
