'use client';
import { useState } from 'react';
import { useGetAuctionsQuery } from '../../store/api';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  // Form state
  const [filters, setFilters] = useState({
    make: '',
    carModel: '',
    year: '',
    price: '',
  });

  // Fetch auctions with filters when submitted
  const { refetch } = useGetAuctionsQuery(filters, { skip: true });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const { data } = await refetch();
    // Navigate to auctions page with filters applied
    router.push(`/car-auction?make=${filters.make}&carModel=${filters.carModel}&year=${filters.year}&price=${filters.price}`);
  };

  return (
    <section
      className="relative h-[700px] w-full flex items-center justify-start bg-cover bg-center"
      style={{ backgroundImage: "url('/images/car1.png')" }} // 🔑 Replace with your image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 lg:px-[100px]">
        {/* Text content */}
        <div className="max-w-xl text-white space-y-6">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium text-sm shadow">
            WELCOME TO AUCTION
          </button>
          <h1 className="text-5xl font-bold leading-tight">
            Find Your <br /> Dream Car
          </h1>
          <p className="text-gray-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus
            elementum cursus tincidunt sagittis elementum suspendisse velit arcu.
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-10 relative">
          <div className="bg-white rounded-md shadow-lg flex flex-col sm:flex-row items-center gap-3 p-3 sm:p-4 max-w-3xl">
            {/* Make */}
            <select
              name="make"
              value={filters.make}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-auto"
            >
              <option value="">Make</option>
              <option value="Audi">Audi</option>
              <option value="BMW">BMW</option>
              <option value="Toyota">Toyota</option>
              <option value="Mercedes">Mercedes</option>
            </select>

            {/* Model */}
            <input
              type="text"
              name="carModel"
              placeholder="Model"
              value={filters.carModel}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-auto"
            />

            {/* Year */}
            <select
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-auto"
            >
              <option value="">Year</option>
              {Array.from({ length: 25 }, (_, i) => 2025 - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Price */}
            <select
              name="price"
              value={filters.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-auto"
            >
              <option value="">Price</option>
              <option value="20000">Up to $20,000</option>
              <option value="50000">Up to $50,000</option>
              <option value="100000">Up to $100,000</option>
            </select>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-blue-700 text-white px-6 py-2 rounded-md flex items-center justify-center w-full sm:w-auto hover:bg-blue-800 transition"
            >
              🔍 Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
