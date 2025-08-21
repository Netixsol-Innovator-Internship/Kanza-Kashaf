"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const saleGames = [
  {
    id: "1",
    title: "Valorant",
    image: "/val.jpg",
    originalPrice: "₹900",
    salePrice: "₹850",
    discount: "-10%",
  },
  {
    id: "2",
    title: "Assassin's creed Valhalla",
    image: "/ass.png",
    originalPrice: "₹3,349",
    salePrice: "₹2,999",
    discount: "-20%",
  },
  {
    id: "3",
    title: "Red Dead Redemption 2",
    image: "/dead.png",
    originalPrice: "₹3,199",
    salePrice: "₹1,599",
    discount: "-50%",
  },
  {
    id: "4",
    title: "The Tomb Raider",
    image: "/tomb.png",
    originalPrice: "₹2,195",
    salePrice: "₹2,000",
    discount: "-20%",
  },
  {
    id: "5",
    title: "Cyberpunk 2077",
    image: "/cyb.png",
    originalPrice: "₹4,000",
    salePrice: "₹2,000",
    discount: "-50%",
  },
  {
    id: "6",
    title: "Valorant",
    image: "/val.jpg",
    originalPrice: "₹900",
    salePrice: "₹850",
    discount: "-10%",
  },
  {
    id: "7",
    title: "Assassin's creed Valhalla",
    image: "/ass.png",
    originalPrice: "₹3,349",
    salePrice: "₹2,999",
    discount: "-20%",
  },
  {
    id: "8",
    title: "Red Dead Redemption 2",
    image: "/dead.png",
    originalPrice: "₹3,199",
    salePrice: "₹1,599",
    discount: "-50%",
  },
  {
    id: "9",
    title: "The Tomb Raider",
    image: "/tomb.png",
    originalPrice: "₹2,195",
    salePrice: "₹2,000",
    discount: "-20%",
  },
  {
    id: "10",
    title: "Cyberpunk 2077",
    image: "/cyb.png",
    originalPrice: "₹4,000",
    salePrice: "₹2,000",
    discount: "-50%",
  },
];

export function GameSlider() {
  const swiperRef = useRef(null);

  return (
    <section className="max-w-[1300px] mx-auto py-8">
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white flex items-center gap-4 mt-2 text-2xl">
            Game on sale
            <span>
              <img src="/arr2.svg" className="rotate-180" alt="" />
            </span>
          </h2>

          <div className="flex space-x-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[rgba(32,32,32,1)] hover-gray-700 text-white"
            >
              <img src="/arr2.svg" alt="Left Arrow" />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[rgba(32,32,32,1)] hover-gray-700 text-white"
            >
              <img src="/arr2.svg" alt="Right Arrow" className="rotate-180" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          loop={true}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 15 },
            900: { slidesPerView: 5, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {saleGames.map((game) => (
            <SwiperSlide key={game.id}>
              <div className="cursor-pointer">
                <div className="bg-a rounded-lg overflow-hidden shadow-md hover-lg transition-shadow duration-300">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-[280px] object-contain bg-black"
                  />
                  <div className="border lg-start p-4">
                    <h3 className="text-white text-sm mb-2">
                      {game.title}
                    </h3>
                    <div className="flex border lg-start items-center space-x-2">
                      <span className="bg-[rgba(0,116,228,1)] text-white px-2 py-0 rounded text-[12px]">
                        {game.discount}
                      </span>
                      <span className="text-gray-400 line-through text-sm">
                        {game.originalPrice}
                      </span>
                      <span className="text-white">{game.salePrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
