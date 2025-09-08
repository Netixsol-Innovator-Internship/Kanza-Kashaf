'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="w-full">
      {/* Hero Container */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center px-6 lg:px-20 py-12 lg:py-20 gap-10">
        {/* Left Column - Text */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-black">
            FIND CLOTHES <br />
            THAT MATCHES <br />
            YOUR STYLE
          </h1>
          <p className="text-gray-600 text-base lg:text-lg max-w-md">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of style.
          </p>
          {/* ✅ Linked Shop Now button */}
          <button
            onClick={() => router.push('/products')}
            className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium w-fit hover:bg-gray-900 transition"
          >
            Shop Now
          </button>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-10 mt-6">
            <div>
              <p className="text-2xl lg:text-3xl font-bold">200+</p>
              <p className="text-sm text-gray-600">International Brands</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold">2,000+</p>
              <p className="text-sm text-gray-600">High-Quality Products</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold">30,000+</p>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="flex justify-center lg:justify-end relative">
          <Image
            src="/bgpic.png"
            alt="Hero Fashion"
            width={600}
            height={700}
            className="object-contain"
          />
          <div className="absolute top-10 right-20 hidden lg:block">
            <Image src="/bigstar.png" alt="big star" width={40} height={40} />
          </div>
          <div className="absolute bottom-10 left-10 hidden lg:block">
            <Image src="/smallstar.png" alt="small star" width={40} height={40} />
          </div>
        </div>
      </div>

      {/* Brand Bar */}
      <div className="bg-black w-full py-6 lg:py-8">
        <div className="max-w-[1440px] mx-auto flex flex-wrap justify-center lg:justify-between items-center gap-8 px-10 lg:px-20">
          <Image src="/versace.png" alt="Versace" width={120} height={40} />
          <Image src="/zara.png" alt="Zara" width={80} height={10} />
          <Image src="/gucci.png" alt="Gucci" width={120} height={40} />
          <Image src="/prada.png" alt="Prada" width={120} height={40} />
          <Image src="/calvinklein.png" alt="Calvin Klein" width={160} height={40} />
        </div>
      </div>
    </section>
  );
}
