"use client";

import React from "react";
import { useRouter } from "next/navigation";

const stylesList = [
  { key: "casual", label: "Casual", img: "/casual.png" },
  { key: "formal", label: "Formal", img: "/formal.png" },
  { key: "party",  label: "Party",  img: "/party.png"  },
  { key: "gym",    label: "Gym",    img: "/gym.png"    },
];

export default function BrowseByStyle() {
  const router = useRouter();

  const onClick = (styleKey: string) => {
    // navigate to products page and set query param styles=<styleKey>
    // products page should read this param and apply filter
    router.push(`/products?styles=${encodeURIComponent(styleKey)}`);
  };

  return (
    <section className="max-w-6xl mx-auto p-8">
      <div className="bg-gray-100 rounded-2xl p-8">
        <h2 className="text-center text-3xl font-extrabold mb-6 tracking-wide">
          BROWSE BY DRESS STYLE
        </h2>

        {/* Grid layout tuned for 1440px visual — left column wider */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "1.6fr 1fr",
            gridTemplateRows: "repeat(2, 220px)",
          }}
        >
          {/* Left column - Casual (top left) */}
          <div
            className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer"
            style={{ gridRow: "1 / 2", gridColumn: "1 / 2" }}
            onClick={() => onClick("casual")}
            aria-label="Casual"
            role="button"
          >
            <img
              src={stylesList[0].img}
              alt="Casual"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
              style={{ minHeight: "110px" }}
            />
            <div className="absolute top-4 left-4 bg-white/85 px-3 py-1 rounded text-lg font-semibold">
              {stylesList[0].label}
            </div>
          </div>

          {/* Right top - Formal */}
          <div
            className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer"
            style={{ gridRow: "1 / 2", gridColumn: "2 / 3" }}
            onClick={() => onClick("formal")}
            aria-label="Formal"
            role="button"
          >
            <img
              src={stylesList[1].img}
              alt="Formal"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/85 px-3 py-1 rounded text-lg font-semibold">
              {stylesList[1].label}
            </div>
          </div>

          {/* Left bottom - Party */}
          <div
            className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer"
            style={{ gridRow: "2 / 3", gridColumn: "1 / 2" }}
            onClick={() => onClick("party")}
            aria-label="Party"
            role="button"
          >
            <img
              src={stylesList[2].img}
              alt="Party"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/85 px-3 py-1 rounded text-lg font-semibold">
              {stylesList[2].label}
            </div>
          </div>

          {/* Right bottom - Gym */}
          <div
            className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer"
            style={{ gridRow: "2 / 3", gridColumn: "2 / 3" }}
            onClick={() => onClick("gym")}
            aria-label="Gym"
            role="button"
          >
            <img
              src={stylesList[3].img}
              alt="Gym"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/85 px-3 py-1 rounded text-lg font-semibold">
              {stylesList[3].label}
            </div>
          </div>
        </div>
      </div>

      {/* responsive adjustments for smaller screens */}
      <style jsx>{`
        @media (max-width: 1024px) {
          section > div > div {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(2, 180px);
          }
        }
        @media (max-width: 640px) {
          section > div {
            padding: 1.25rem;
          }
          section > div > div {
            grid-template-columns: 1fr;
            grid-template-rows: none;
          }
          section > div > div > div {
            height: 200px !important;
          }
        }
      `}</style>
    </section>
  );
}
