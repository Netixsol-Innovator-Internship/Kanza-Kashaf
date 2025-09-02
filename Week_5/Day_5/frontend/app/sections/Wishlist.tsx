"use client"

import Link from "next/link"
import { Star } from "lucide-react"
import { useEffect, useState } from "react"
import {
  useGetProfileQuery,
  useToggleWishlistMutation,
} from "../../store/api"

const Wishlist = () => {
  const { data: user, isLoading, isError } = useGetProfileQuery()
  const [updateWishlist] = useToggleWishlistMutation()
  const [wishlist, setWishlist] = useState<any[]>([])

  // Sync local state when user data loads
  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist)
    }
  }, [user])

  if (isLoading) return <p>Loading wishlist...</p>
  if (isError) return <p>Failed to load wishlist.</p>
  if (!wishlist?.length) return <p>No cars in wishlist.</p>

  const handleRemove = async (auctionId: string) => {
    setWishlist((prev) => prev.filter((a) => a._id !== auctionId))
    try {
      await updateWishlist(auctionId).unwrap()
    } catch (error) {
      console.error("Failed to update wishlist:", error)
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">
        Wishlist <span className="text-gray-500">({wishlist.length})</span>
      </h2>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlist.map((auction: any) => (
          <AuctionCard
            key={auction._id}
            auction={auction}
            handleRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  )
}

const AuctionCard = ({
  auction,
  handleRemove,
}: {
  auction: any
  handleRemove: (id: string) => void
}) => {
  const [timeLeft, setTimeLeft] = useState(
    new Date(auction.endTime).getTime() - Date.now()
  )

  // ⏳ Live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(new Date(auction.endTime).getTime() - Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [auction.endTime])

  const days = Math.max(Math.floor(timeLeft / (1000 * 60 * 60 * 24)), 0)
  const hours = Math.max(Math.floor((timeLeft / (1000 * 60 * 60)) % 24), 0)
  const minutes = Math.max(Math.floor((timeLeft / (1000 * 60)) % 60), 0)
  const seconds = Math.max(Math.floor((timeLeft / 1000) % 60), 0)

  return (
    <div className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col relative">
      {/* Trending Tag */}
      {auction.trending && (
        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded">
          Trending
        </span>
      )}

      {/* Wishlist Star */}
      <button
        className="absolute top-3 right-3"
        onClick={() => handleRemove(auction._id)}
      >
        <Star
          size={20}
          className="text-yellow-500 fill-yellow-500 drop-shadow"
        />
      </button>

      {/* Car Image */}
      <img
        src={auction.photos?.[0] || "/placeholder-car.jpg"}
        alt={`${auction.make} ${auction.carModel}`}
        className="w-full h-56 object-cover"
      />

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900">
          {auction.make} {auction.carModel}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {auction.description ||
            "Lorem ipsum dolor sit amet consectetur. Vehicula."}
        </p>

        {/* Price + Bids + End Time */}
        <div className="grid grid-cols-3 text-sm text-gray-600 mb-4">
          <div>
            <p className="font-bold text-black">
              ${auction.currentPrice?.toLocaleString() || 0}
            </p>
            <p>Current Bid</p>
          </div>
          <div>
            <p className="font-bold text-black">
              {auction.totalBids || 0}
            </p>
            <p>Total Bids</p>
          </div>
          <div>
            <p className="font-bold text-black">
              {new Date(auction.endTime).toLocaleDateString()}{" "}
              {new Date(auction.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs">Ends</p>
          </div>
        </div>

        {/* Live Countdown */}
        <div className="text-xs text-gray-500 mb-3">
          {days}d {hours}h {minutes}m {seconds}s left
        </div>

        {/* Action Button */}
        <Link href={`/LiveAuctionDetails/${auction._id}`}>
          <button className="w-full py-2 border border-[#1C2D7A] text-[#1C2D7A] font-medium rounded-lg hover:bg-[#1C2D7A] hover:text-white transition">
            Submit A Bid
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Wishlist
