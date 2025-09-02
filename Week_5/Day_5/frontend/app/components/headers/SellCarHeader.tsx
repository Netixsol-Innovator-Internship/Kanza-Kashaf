"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"

const SellCarHeader = () => {
  return (
    <section className="w-full bg-[#CBDDFD] pt-8 px-4">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-semibold text-[#1E3A8A] pb-3">
          Sell Your Car
        </h1>
        {/* Underline */}
        <div className="w-20 h-[3px] bg-[#1E3A8A] mt-2 mb-4"></div>

        {/* Subtitle */}
        <p className="text-[#374151] max-w-xl text-sm md:text-base">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu mus.
        </p>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mt-6 px-4 py-2 bg-[#BFD3FA] rounded-sm text-sm">
          <Link href="/" className="text-[#1E3A8A] hover:underline">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-[#1E3A8A]" />
          <span className="text-[#1E3A8A] font-medium">Sell Your Car</span>
        </div>
      </div>
    </section>
  )
}

export default SellCarHeader
