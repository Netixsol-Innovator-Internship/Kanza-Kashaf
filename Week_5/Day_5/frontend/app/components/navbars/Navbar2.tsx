"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "../../../store/store"

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState("Home")

  // Get unread notifications count from Redux
  const unreadCount = useSelector(
    (state: RootState) =>
      state.notifications.list.filter((n) => !n.read).length
  )

  // Menu items with routes
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Car Auction", href: "/AuctionListingPage" },
    { label: "Sell Your Car", href: "/SellYourCar" },
    { label: "About us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header className="w-full border-b border-[#CBD5E1] bg-[#EDF2FE]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-6 lg:px-[100px] flex items-center justify-between h-[82px]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo1.png"
            alt="Car Deposit Logo"
            width={160}
            height={100}
          />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setActive(label)}
              className={`relative text-sm font-medium transition-colors ${
                active === label
                  ? "text-[#1E3A8A]"
                  : "text-[#374151] hover:text-[#1E3A8A]"
              }`}
            >
              {label}
              {active === label && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-[#1E3A8A]"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-5 text-[#1E3A8A]">
          <Link href="/ProfilePage">
            <Image
              src="/images/person.png"
              alt="profile"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </Link>

          <Link href="/Wishlist">
            <Image
              src="/images/star.png"
              alt="star"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </Link>

          {/* Notifications with badge */}
          <Link href="/Notifications" className="relative">
            <Image
              src="/images/bell.png"
              alt="bell"
              width={20}
              height={20}
              className="cursor-pointer"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-1.5">
            <Link href="/MyCars" className="flex items-center gap-1.5">
              <Image
                src="/images/car.png"
                alt="car"
                width={20}
                height={20}
                className="cursor-pointer"
              />
              <Image
                src="/images/arrow.png"
                alt="arrow"
                width={10}
                height={10}
                className="cursor-pointer"
              />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#1E3A8A]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#EDF2FE] border-t border-[#CBD5E1] px-4 py-3 space-y-3">
          {menuItems.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => {
                setActive(label)
                setIsOpen(false)
              }}
              className={`block w-full text-left text-sm font-medium ${
                active === label ? "text-[#1E3A8A]" : "text-[#374151]"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Mobile Icons */}
          <div className="flex gap-4 mt-4 text-[#1E3A8A]">
            <Link href="/ProfilePage">
              <Image
                src="/images/person.png"
                alt="profile"
                width={15}
                height={15}
                className="cursor-pointer"
              />
            </Link>
            <Link href="/Wishlist">
              <Image
                src="/images/star.png"
                alt="star"
                width={15}
                height={15}
                className="cursor-pointer"
              />
            </Link>

            {/* Notifications with badge (mobile) */}
            <Link href="/Notifications" className="relative">
              <Image
                src="/images/bell.png"
                alt="bell"
                width={15}
                height={15}
                className="cursor-pointer"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link href="/MyCars">
              <Image
                src="/images/car.png"
                alt="car"
                width={15}
                height={15}
                className="cursor-pointer"
              />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar2
