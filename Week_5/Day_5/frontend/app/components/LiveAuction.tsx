// components/LiveAuction.tsx
'use client';

import { useEffect, useState } from "react";
import {
  useGetAuctionsQuery,
  useGetProfileQuery,
  useToggleWishlistMutation,
} from "../../store/api";
import Link from "next/link";
import { Star } from "lucide-react";

// Utility to format countdown
const formatTimeLeft = (endTime: string) => {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "00 : 00 : 00";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(
    2,
    "0"
  )} : ${String(seconds).padStart(2, "0")}`;
};

const LiveAuction = () => {
  // use RTK Query - this cache will be invalidated by SocketListener on server events
  const { data: auctions, isLoading, error } = useGetAuctionsQuery({});
  const { data: user } = useGetProfileQuery();
  const [toggleWishlist] = useToggleWishlistMutation();
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});

  // derive live auctions from query results (reactive)
  const liveAuctions = (auctions || []).filter((a: any) => a.status === "live");

  // update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const updated: Record<string, string> = {};
        liveAuctions.forEach((auction: any) => {
          updated[auction._id] = formatTimeLeft(auction.endTime);
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [liveAuctions]);

  // --- Wishlist toggle (using RTK Query) ---
  const handleToggleWishlist = async (auctionId: string) => {
    try {
      await toggleWishlist(auctionId).unwrap();
      // SocketListener will invalidate profile; UI will update automatically
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  const isInWishlist = (auctionId: string) =>
    user?.wishlist?.some((item: any) => item._id === auctionId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching live auctions</div>;

  return (
    <div className="w-full bg-[#1C2D7A] py-10 px-6 my-16 md:px-12 lg:px-24">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl mb-8 font-bold text-white relative inline-block">
          Live Auction
          <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-50 w-6 h-6 bg-[#F9C146] rotate-45 rounded-sm"></span>
          <div className="absolute -bottom-[2.3rem] left-1/2 -translate-x-1/2 w-[230px] h-[2px] bg-gray-400"></div>
        </h2>
      </div>

      {/* Sub Nav */}
      <div className="mb-8 w-full border-b border-gray-500">
        <button className="text-white font-medium pb-2 border-b-4 border-[#F9C146]">
          Live Auction
        </button>
      </div>

      {/* Auction Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {liveAuctions.map((auction: any) => (
          <div
            key={auction._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden relative"
          >
            {/* Trending Label */}
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded">
              Trending
            </span>

            {/* Favorite Icon */}
            <button
              onClick={() => handleToggleWishlist(auction._id)}
              className="absolute top-3 right-3"
            >
              <Star
                size={20}
                className={`${
                  isInWishlist(auction._id)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-400"
                }`}
              />
            </button>

            {/* Car Image */}
            <img
              src={auction.photos?.[0]}
              alt={`${auction.make} ${auction.carModel}`}
              className="w-full h-48 object-cover"
            />

            {/* Card Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {auction.make} {auction.carModel}
              </h3>

              <div className="flex justify-between items-center mt-4 text-sm">
                <div>
                  <p className="font-bold">${auction.currentPrice}</p>
                  <p>Current Bid</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {timeLeft[auction._id] || "00 : 00 : 00"}
                  </p>
                  <p>Time Left</p>
                </div>
              </div>

              <Link key={auction._id} href={`/LiveAuctionDetails/${auction._id}`}>
                <button className="w-full mt-10 py-2 bg-[#1C2D7A] text-white rounded-lg font-medium hover:bg-[#15225d] transition">
                  Submit A Bid
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* See All Button */}
      <div className="text-center mt-10">
        <Link href="/AuctionListingPage">
          <button className="px-6 py-2 bg-[#F9C146] text-black font-semibold rounded-lg hover:bg-[#e6ad30] transition">
            See All
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LiveAuction;
