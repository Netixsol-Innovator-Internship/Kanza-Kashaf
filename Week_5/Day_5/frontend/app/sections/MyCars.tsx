"use client";

import { useGetMyAuctionsQuery, useEndAuctionMutation } from "../../store/api";
import { Button } from "../components/ui/button";

interface Auction {
  _id: string;
  make: string;
  carModel: string;
  year: number;
  minBid: number;
  photos: string[];
  status: "live" | "ended" | "paid";
  winnerId?: string | null;
  totalBids?: number;
  endTime?: string;
  currentPrice?: number;
}

const MyCars = () => {
  const { data: auctions = [], isLoading, isError, refetch } = useGetMyAuctionsQuery();
  const [endAuction, { isLoading: ending }] = useEndAuctionMutation();

  const handleEndBid = async (id: string) => {
    try {
      await endAuction(id).unwrap();
      refetch();
    } catch (err: any) {
      alert("Failed to end auction: " + err.message);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load cars.</p>;
  if (!auctions.length) return <p>No cars yet.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">My Cars</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {auctions.map((auction: Auction) => {
          const timeLeft = auction.endTime
            ? new Date(auction.endTime).getTime() - Date.now()
            : 0;

          return (
            <div
              key={auction._id}
              className="border rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              {/* Auction Image */}
              <div className="relative w-full aspect-video">
                <img
                  src={auction.photos?.[0] || "/placeholder-car.jpg"}
                  alt={auction.carModel || "Car image"}
                  className="object-cover w-full h-full rounded-t-2xl"
                />
                {auction.status === "live" && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Live
                  </span>
                )}
              </div>

              {/* Auction Info */}
              <div className="flex-1 flex flex-col p-4 space-y-3">
                <h3 className="font-semibold text-lg truncate">
                  {auction.year} {auction.make} {auction.carModel}
                </h3>

                {/* Prices */}
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-500">Winning Bid</p>
                    <p className="font-bold">
                      ${auction.currentPrice?.toLocaleString() || auction.minBid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Bid</p>
                    <p className="font-bold text-blue-700">
                      ${auction.currentPrice?.toLocaleString() || auction.minBid.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Meta Info (countdown only if live) */}
                {auction.status === "live" && auction.endTime && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <p>
                      {Math.floor(timeLeft / (1000 * 60 * 60 * 24))}d{" "}
                      {Math.floor((timeLeft / (1000 * 60 * 60)) % 24)}h{" "}
                      {Math.floor((timeLeft / (1000 * 60)) % 60)}m
                    </p>
                    <p>{auction.totalBids || 0} Total Bids</p>
                  </div>
                )}

                {/* Action Buttons (MyCars logic preserved) */}
                {auction.status === "live" ? (
                  <Button
                    onClick={() => handleEndBid(auction._id)}
                    disabled={ending}
                    className="w-full mt-auto bg-red-600 hover:bg-red-700 text-white"
                  >
                    {ending ? "Ending..." : "End Bid"}
                  </Button>
                ) : auction.status === "ended" && auction.winnerId ? (
                  <Button
                    disabled
                    className="w-full mt-auto bg-green-600 text-white opacity-70 cursor-not-allowed"
                  >
                    Sold
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="w-full mt-auto bg-gray-400 text-white opacity-70 cursor-not-allowed"
                  >
                    Unsold
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCars;
