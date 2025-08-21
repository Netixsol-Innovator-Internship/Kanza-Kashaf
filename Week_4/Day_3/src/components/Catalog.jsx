import React from "react";

export function Catalog() {
  return (
    <section className="text-white">
      <div className="container mx-auto px-4 py-10 md:pb-26">
        <div className="flex flex-col md:flex-row items-center md:items-stretch rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <img
              src="/catlog.jpg"
              alt="Catalog Banner"
              className="w-full h-64 md:h-full object-cover rounded-2xl"
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 bg-black/50 flex items-center justify-center p-6 text-white">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-semibold mb-4">
                Explore our Catalog
              </h1>
              <p className="text-white/60">
                Browse by genre, features, price, and more to find your next
                favorite game.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
