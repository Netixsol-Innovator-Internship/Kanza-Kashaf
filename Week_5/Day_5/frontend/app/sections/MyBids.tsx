"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Star } from "lucide-react"
import {
  useGetProfileQuery,
  useToggleWishlistMutation,
} from "../../store/api"

const MyBids = ({ bids }: { bids: any[] }) => {
  const { data: user, refetch: refetchUser } = useGetProfileQuery()
  const [toggleWishlist] = useToggleWishlistMutation()

  const handleToggleWishlist = async (auctionId: string) => {
    try {
      await toggleWishlist(auctionId).unwrap()
      refetchUser() // refresh wishlist after toggle
    } catch (err) {
      console.error("Failed to toggle wishlist:", err)
    }
  }

  const isInWishlist = (auctionId: string) =>
    user?.wishlist?.some((item: any) => item._id === auctionId)

  if (!bids?.length) return <p>No bids placed.</p>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">My Bids</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bids.map((auction) => (
          <AuctionCard
            key={auction._id}
            auction={auction}
            isInWishlist={isInWishlist}
            handleToggleWishlist={handleToggleWishlist}
          />
        ))}
      </div>
    </div>
  )
}

const AuctionCard = ({
  auction,
  isInWishlist,
  handleToggleWishlist,
}: {
  auction: any
  isInWishlist: (id: string) => boolean
  handleToggleWishlist: (id: string) => void
}) => {
  const isWinning = auction?.winnerId === auction?.currentUserId
  const [timeLeft, setTimeLeft] = useState(
    new Date(auction.endTime).getTime() - Date.now()
  )

  // ⏳ Update countdown every second
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
    <div className="border rounded-2xl shadow-md overflow-hidden flex flex-col relative">
      {/* Wishlist Star */}
      <button
        onClick={() => handleToggleWishlist(auction._id)}
        className="absolute top-3 right-3 z-10"
      >
        <Star
          size={22}
          className={`${
            isInWishlist(auction._id)
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-400"
          }`}
        />
      </button>

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
          {auction.make} {auction.carModel}
        </h3>

        {/* Prices */}
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-500">Winning Bid</p>
            <p className="font-bold">
              ${auction.currentPrice.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Your Current Bid</p>
            <p
              className={`font-bold ${
                isWinning ? "text-green-600" : "text-red-600"
              }`}
            >
              ${auction.currentPrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between text-xs text-gray-500">
          <p>
            {days}d {hours}h {minutes}m {seconds}s
          </p>
          <p>{auction.totalBids} Total Bids</p>
        </div>

        {/* Action */}
        <Link href={`/LiveAuctionDetails/${auction._id}`}>
          <Button
            className="w-full mt-auto bg-blue-900 text-white"
            disabled={isWinning}
          >
            Submit A Bid
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default MyBids
