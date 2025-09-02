"use client";
import { useEffect, useState } from "react";
import {
  useGetAuctionDetailsQuery,
  useCheckIfUserIsLoggedInQuery,
  usePlaceBidMutation,
  useGetAuctionBidsQuery,
  useToggleWishlistMutation,
} from "../../../store/api";
import { useParams, useRouter } from "next/navigation";
import Navbar2 from "../../components/navbars/Navbar2";
import { Star } from "lucide-react";

const LiveAuctionDetails = () => {
  const params = useParams();
  const router = useRouter();
  const auctionId = params?.id as string;

  // Auction data
  const { data: auction, isLoading, error } = useGetAuctionDetailsQuery(
    auctionId,
    { skip: !auctionId }
  );

  const { data: user, refetch } = useCheckIfUserIsLoggedInQuery();
  const [placeBid, { isLoading: placingBid }] = usePlaceBidMutation();
  const [toggleWishlist] = useToggleWishlistMutation();

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [mainImage, setMainImage] = useState<string>("");

  const minIncrement = auction?.minIncrement || 100;

  const { data: bids, isLoading: loadingBids } = useGetAuctionBidsQuery(auctionId, { skip: !auctionId });

  // Init bid & main image
  useEffect(() => {
    if (auction) {
      setMainImage(auction.photos[0]);
      if (auction.currentPrice > 0) {
        setBidAmount(auction.currentPrice + minIncrement);
      } else {
        setBidAmount(auction.minBid || minIncrement);
      }
    }
  }, [auction, minIncrement]);

  // Countdown
  useEffect(() => {
    if (!auction?.endTime) return;
    const endTime = new Date(auction.endTime);
    const timer = setInterval(() => {
      setTimeLeft(
        Math.max(0, Math.floor((endTime.getTime() - new Date().getTime()) / 1000))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [auction?.endTime]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  const handleIncrement = () => setBidAmount((p) => p + minIncrement);
  const handleDecrement = () => {
    const base =
      auction?.currentPrice > 0
        ? auction.currentPrice + minIncrement
        : auction?.minBid || minIncrement;
    setBidAmount((p) => Math.max(p - minIncrement, base));
  };

  const handleSubmitBid = async () => {
    try {
      if (!user) {
        alert("Please log in first.");
        router.push("/login");
        return;
      }
      await placeBid({ auctionId, amount: bidAmount }).unwrap();
      alert("Bid placed successfully!");
    } catch (err: any) {
      alert("Error placing bid: " + (err?.data?.message || err.message));
    }
  };

  // --- Wishlist toggle ---
  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(auctionId).unwrap();
      refetch(); // refresh wishlist
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  const isInWishlist = user?.wishlist?.some(
    (item: any) => item._id === auctionId
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching auction details</div>;

  return (
    <>
      <Navbar2 />
      <section className="max-w-[1440px] mx-auto p-6">
        {/* Title with Wishlist Star */}
        <div className="bg-[#1E3A8A] text-white py-3 px-6 rounded-t-lg text-lg font-semibold flex justify-between items-center">
          <span>
            {auction?.make} {auction?.carModel}
          </span>
          <button onClick={handleToggleWishlist} className="ml-4">
            <Star
              size={22}
              className={`${
                isInWishlist ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-b-lg p-6">
          {/* Row 1: Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Left: Main Image */}
            <div>
              <img
                src={mainImage}
                alt="Main Car"
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>

            {/* Right: Thumbnail Grid */}
            <div className="grid grid-cols-3 gap-3">
              {auction?.photos.slice(0, 6).map((photo: string, i: number) => (
                <img
                  key={i}
                  src={photo}
                  alt={`thumb-${i}`}
                  onClick={() => setMainImage(photo)}
                  className={`h-32 w-full object-cover rounded cursor-pointer border-2 ${
                    mainImage === photo ? "border-blue-600" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>


          {/* Row 2: Two Columns */}
          <div className="mt-8 flex flex-col lg:flex-row gap-6">
            {/* Left Column */}
            <div className="flex-1 space-y-8">
              {/* Auction Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="font-semibold">Time Left</p>
                  <p className="text-gray-700">{formatTime(timeLeft)}</p>
                </div>
                <div>
                  <p className="font-semibold">Current Bid</p>
                  <p className="text-gray-700">${auction?.currentPrice}</p>
                </div>
                <div>
                  <p className="font-semibold">End Time</p>
                  <p className="text-gray-700">
                    {new Date(auction?.endTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Min. Increment</p>
                  <p className="text-gray-700">${minIncrement}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Bids</p>
                  <p className="text-gray-700">{auction?.totalBids}</p>
                </div>
                <div>
                  <p className="font-semibold">Lot No.</p>
                  <p className="text-gray-700">#{auction?._id.slice(-6)}</p>
                </div>
                <div>
                  <p className="font-semibold">Odometer</p>
                  <p className="text-gray-700">{auction?.mileage} km</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">
                  {auction?.features || "No description available."}
                </p>
              </div>

              {/* Top Bidder */}
              {auction?.highest && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">
                    Top Bidder
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden text-lg font-bold text-indigo-600">
                      {auction.highest.bidderAvatar ? (
                        <img
                          src={auction.highest?.bidderAvatar}
                          alt="Bidder Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        auction.highest.bidderName?.[0] || "U"
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {auction.highest.bidderName}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {auction.highest.bidderEmail}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {auction.highest.bidderPhone}
                      </p>
                      <p>
                        <span className="font-semibold">Nationality:</span>{" "}
                        {auction.highest.bidderNationality}
                      </p>
                      <p>
                        <span className="font-semibold">ID Type:</span>{" "}
                        {auction.highest.bidderIdType}
                      </p>
                      <p>
                        <span className="font-semibold">Bid:</span> $
                        {auction.highest.bid}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[400px] space-y-8">
              {/* Place a Bid */}
              <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Submit a Bid
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecrement}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={bidAmount}
                    readOnly
                    className="border text-center py-2 px-4 w-32 rounded"
                  />
                  <button
                    onClick={handleIncrement}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleSubmitBid}
                  disabled={placingBid}
                  className="mt-4 w-full py-2 bg-blue-700 text-white rounded font-semibold"
                >
                  {placingBid ? "Placing..." : "Submit A Bid"}
                </button>
              </div>

              {/* Bidders List */}
              <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Bidders List</h3>
                <ul className="space-y-2">
                  {loadingBids ? (
                    <li>Loading...</li>
                  ) : bids && bids.length > 0 ? (
                    bids.map((bid: any, i: number) => (
                      <li
                        key={bid._id}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span>{bid.bidderId?.fullName || `Bidder ${i + 1}`}</span>
                        <span>${bid.amount}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">No bids yet</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LiveAuctionDetails;
