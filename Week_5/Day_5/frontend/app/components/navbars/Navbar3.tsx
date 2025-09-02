"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image"

const Navbar3 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");

  const navItems = ["Home", "Car Auction", "Sell Your Car", "About us", "Contact"];

  return (
    <header className="w-full bg-transparent absolute z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px] flex items-center justify-between h-20">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
            <Image
                src="/images/logo1.png"
                alt="Car Deposit Logo"
                width={160}
                height={100}
            />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`relative font-medium ${
                active === item ? "text-white" : "text-white"
              } hover:text-yellow-400`}
            >
              {item}
              {active === item && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[3px] bg-yellow-400 rounded"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="text-white font-medium">
            Sign in
          </Link>
          <span className="text-gray-400">or</span>
          <Link
            href="/register"
            className="bg-[#1E3A8A] text-white px-4 py-2 rounded-md hover:bg-[#162b66]"
          >
            Register now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-[#1E3A8A] text-white px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActive(item);
                setMenuOpen(false);
              }}
              className={`block w-full text-left ${
                active === item ? "text-yellow-400" : "text-white"
              }`}
            >
              {item}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-500">
            <Link href="/login" className="block py-2">
              Sign in
            </Link>
            <Link
              href="/register"
              className="block bg-yellow-500 text-black px-4 py-2 mt-2 rounded"
            >
              Register now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar3;
