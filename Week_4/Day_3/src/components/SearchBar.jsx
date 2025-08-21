'use client'

import Image from "next/image";
import { useState } from "react";

export default function SearchBar() {
  const [activeTab, setActiveTab] = useState("Discover");

  const tabs = ["Discover", "Browse", "News"];

  return (
    <section>
      <div className="flex mt-2 sm:mt-4 p-2 sm:p-4 flex-col sm:flex-row text-white items-center gap-2 sm:gap-4 md:gap-7 w-full">
        <div className="relative w-full sm:w-auto">
          <Image
            src="/search.svg"
            alt="search icon"
            width={20}
            height={20}
            className="md:w-6 md:h-6 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none sm:w-[30px] sm:h-[30px]"
          />
          <input
            type="search"
            className="bg-[rgba(32,32,32,1)] text-[rgba(160,160,160,1)] rounded-full px-8 sm:px-10 py-2 sm:py-3 focus:outline-none w-full sm:w-auto min-w-[200px] text-sm sm:text-base"
            placeholder="Search Store"
          />
        </div>

        <nav className="flex gap-3 sm:gap-6 flex-wrap justify-center sm:justify-start">
          {tabs.map((tab) => (
            <p
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer text-sm sm:text-base whitespace-nowrap ${
                activeTab === tab ? "text-white" : "text-[rgba(160,160,160,1)]"
              }`}
            >
              {tab}
            </p>
          ))}
        </nav>
      </div>
    </section>
  );
}
