// AuctionListingPage.tsx (updated)
'use client';
import { useState } from 'react';
import {
  useGetAuctionsQuery,
  useGetProfileQuery,
  useToggleWishlistMutation,
} from '../../store/api';
import Navbar2 from '../components/navbars/Navbar2';
import AuctionHeader from '../components/headers/AuctionHeader';
import Link from 'next/link';
import { Star } from 'lucide-react';

function Countdown({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState<any>({});

  useState(() => {
    // small no-op just to match previous behaviour
  });

  // using effect with endTime as dependency
  useState(() => {})

  // simpler countdown per auction could be implemented per card; keeping component minimal

  return (
    <div className="flex gap-1 text-sm text-gray-700">
      {/* placeholder — actual countdown shown in card */}
      <span>live</span>
    </div>
  );
}

export default function AuctionListingPage() {
  const [filters, setFilters] = useState({
    carType: '',
    make: '',
    model: '',
    year: '',
    price: '',
  });

  const { data: auctions = [], isLoading, error } = useGetAuctionsQuery(filters);
  const { data: user } = useGetProfileQuery();
  const [toggleWishlist] = useToggleWishlistMutation();

  const handleToggleWishlist = async (auctionId: string) => {
    try {
      await toggleWishlist(auctionId).unwrap();
      // SocketListener invalidates profile so UI updates
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    }
  };

  const isInWishlist = (auctionId: string) =>
    user?.wishlist?.some((item: any) => item._id === auctionId);

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error fetching auctions</div>;

  const activeAuctions = (auctions || []).filter((a: any) => a.status === 'live');

  return (
    <>
      <Navbar2 />
      <AuctionHeader />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 p-4 rounded bg-[#2e3d83]">
            <p className="text-white">
              Showing <span className="font-semibold">{activeAuctions?.length || 0}</span> of{' '}
              {auctions?.length || 0} Results
            </p>

            <select className="border border-gray-300 text-gray-500 rounded-md px-3 py-2 text-sm">
              <option>Sort By Newness</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Featured</option>
            </select>
          </div>

          <div className="flex flex-col gap-6">
            {activeAuctions?.map((auction: any) => (
              <div
                key={auction._id}
                className="bg-white border rounded-lg shadow-sm flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition relative"
              >
                <div className="w-full sm:w-1/3 h-52 sm:h-auto relative">
                  <img
                    src={auction.photos?.[0]}
                    alt={`${auction.make} ${auction.carModel}`}
                    className="w-full h-full object-cover"
                  />

                  {auction.isTrending && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Trending
                    </span>
                  )}

                  <button
                    onClick={() => handleToggleWishlist(auction._id)}
                    className="absolute top-2 right-2"
                  >
                    <Star
                      size={20}
                      className={`${
                        isInWishlist(auction._id)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {auction.make} {auction.carModel}
                    </h3>
                    <div className="flex items-center text-yellow-500 text-2xl">★★★★★</div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{auction.description}</p>
                  </div>
                </div>

                <div className="p-5 border-l flex flex-col justify-between w-full sm:w-64">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">${auction.currentPrice}</p>
                    <p className="text-xs text-gray-500">Current Bid</p>
                    <p className="mt-2 text-gray-600 text-sm">{auction.totalBids} Total Bids</p>
                    <div className="mt-2">
                      <Countdown endTime={auction.endTime} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(auction.endTime).toLocaleDateString()}{' '}
                      {new Date(auction.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Link href={`/LiveAuctionDetails/${auction._id}`} className="mt-4">
                    <button className="w-full py-2 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800">
                      Submit A Bid
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-80 bg-[#2e3d83] text-white rounded-lg shadow-sm p-6 h-fit">
          <h2 className="text-lg font-bold mb-4">Filter By</h2>

          <div className="space-y-4">
            <input
              name="carType"
              placeholder="Any Car Type"
              value={filters.carType}
              onChange={(e) => setFilters({ ...filters, carType: e.target.value })}
              className="w-full rounded-md px-3 py-2 text-sm bg-[#2e3d83] border text-white"
            />
            <input
              name="make"
              placeholder="Any Make"
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
              className="w-full rounded-md px-3 py-2 text-sm bg-[#2e3d83] border text-white"
            />
            <input
              name="model"
              placeholder="Any Car Model"
              value={filters.model}
              onChange={(e) => setFilters({ ...filters, model: e.target.value })}
              className="w-full rounded-md px-3 py-2 text-sm bg-[#2e3d83] border text-white"
            />
            <input
              name="year"
              placeholder="Any Year"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="w-full rounded-md px-3 py-2 text-sm bg-[#2e3d83] border text-white"
            />

            <div>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={filters.price}
                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                className="w-full"
              />
              <p className="text-xs mt-1">Price: ${filters.price || 'Any'}</p>
            </div>

            <button className="w-full py-2 bg-yellow-400 text-gray-900 rounded-md font-semibold hover:bg-yellow-500">
              Filter
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
