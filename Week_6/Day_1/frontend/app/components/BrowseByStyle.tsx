"use client";

import React from "react";
import { useRouter } from "next/navigation";

const stylesList = [
  { key: "casual", label: "Casual", img: "/casual.png" },
  { key: "formal", label: "Formal", img: "/formal.png" },
  { key: "party", label: "Party", img: "/party.png" },
  { key: "gym", label: "Gym", img: "/gym.png" },
];

export default function BrowseByStyle() {
  const router = useRouter();

  const onClick = (styleKey: string) => {
    router.push(`/products?styles=${encodeURIComponent(styleKey)}`);
  };

  return (
    <section className="max-w-6xl mx-auto p-8">
      <div className="bg-gray-100 rounded-2xl p-8">
        <h2 className="text-center text-3xl font-extrabold mb-6 tracking-wide">
          BROWSE BY DRESS STYLE
        </h2>

        {/* Desktop & Tablet: 2 rows × 3 cols with spans */}
        <div className="grid grid-cols-3 grid-rows-2 gap-6 sm:grid-cols-3 sm:grid-rows-2">
          {/* Row 1 - Casual */}
          <div
            className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer"
            onClick={() => onClick("casual")}
          >
            <img
              src={stylesList[0].img}
              alt="Casual"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 min-h-[220px]"
            />
            <div className="absolute top-4 left-4 bg-white/85 px-3 py-1 rounded text-lg font-semibold">
              {stylesList[0].label}
            </div>
          </div>

          {/* Row 1 - Formal (col-span-2 desktop) */}
          <div
            className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer sm:col-span-2"
            onClick={() => onClick("formal")}
          >
            <img
              src={stylesList[1].img}
              alt="Formal"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 min-h-[220px]"
            />
            <div className="absolute top-4 left-4 bg-white/85 px-3 py-1 rounded text-lg font-semibold">
              {stylesList[1].label}
            </div>
          </div>

          {/* Row 2 - Party (col-span-2 desktop) */}
          <div
            className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer sm:col-span-2"
            onClick={() => onClick("party")}
          >
            <img
              src={stylesList[2].img}
              alt="Party"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 min-h-[220px]"
            />
            <div className="absolute top-4 left-4 bg-white/85 px-3 py-1 rounded text-lg font-semibold">
              {stylesList[2].label}
            </div>
          </div>

          {/* Row 2 - Gym */}
          <div
            className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer"
            onClick={() => onClick("gym")}
          >
            <img
              src={stylesList[3].img}
              alt="Gym"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 min-h-[220px]"
            />
            <div className="absolute top-4 left-4 bg-white/85 px-3 py-1 rounded text-lg font-semibold">
              {stylesList[3].label}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile (<640px): 1 column, equal height cards */}
      <style jsx>{`
        @media (max-width: 639px) {
          section > div > div {
            grid-template-columns: 1fr !important;
            grid-template-rows: none !important;
          }
          section > div > div > div {
            height: 220px !important;
          }
        }
      `}</style>
    </section>
  );
}
