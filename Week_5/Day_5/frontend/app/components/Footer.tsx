// components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#24347D] text-white">
      {/* Top Section */}
      <div className="max-w-[1440px] mx-auto ml-[100px] px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-[0.32fr_0.2fr_0.5fr] gap-10">

        {/* Left: Logo + Description */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/logo1.png"
              alt="Car Deposit"
              width={140}
              height={100}
            />
          </div>
          <p className="text-sm leading-relaxed text-gray-200">
            Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin
            turpis pretium donec orci semper. Sit suscipit lacus cras commodo in
            lectus sed egestas. Mattis egestas sit viverra pretium tincidunt
            libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar.
            Odio egestas egestas tristique et lectus viverra in sed mauris.
          </p>
        </div>

        {/* Middle: Links */}
        <div className="flex flex-col space-y-2 ml-[80px]">
          <h3 className="font-semibold">Home</h3>
          <Link href="#" className="text-sm text-gray-200 hover:text-white">
            Help Center
          </Link>
          <Link href="#" className="text-sm text-gray-200 hover:text-white">
            FAQ
          </Link>
        </div>

        {/* Right: Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold">Car Aucation</h3>
          <Link href="#" className="text-sm text-gray-200 hover:text-white">
            Help Center
          </Link>
          <Link href="#" className="text-sm text-gray-200 hover:text-white">
            My Account
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-600"></div>

      {/* Bottom Copyright */}
      <div className="text-center py-4">
        <p className="text-sm text-gray-200">
          <Link href="#" className="underline">
            Copyright 2022
          </Link>{" "}
          All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
