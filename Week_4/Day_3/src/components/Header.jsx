"use client"
import { useState } from "react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-[rgba(49,49,49,1)]">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between pl-4 relative">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <img src="/image2.svg" alt="Logo" className="w-7 h-9" />
          </div>

          <nav className="hidden md:flex relative h-full">
            {["STORE", "FAQ", "HELP", "UNREAL ENGINE"].map((item, idx) => (
              <div key={idx} className="relative group flex h-full">
                <a
                  href="#"
                  className="text-gray-300 text-sm group-hover:text-white transition-colors flex items-center h-full px-4"
                >
                  {item}
                </a>
                <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#007AFF] scale-x-0 group-hover:scale-x-80 origin-center transition-transform"></div>
              </div>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="cursor-pointer hover:text-white pr-8">
            <img src="/Vector.svg" alt="Search" className="w-5 h-5" />
          </div>

          <div className="text-gray-300 flex items-center cursor-pointer space-x-2 hover:text-white">
            <img src="/Frame.svg" alt="Sign In" className="w-5 h-5" />
            <p className="text-xs">SIGN IN</p>
          </div>

          <div className="text-sm bg-[#007AFF] hover:bg-blue-700 text-white px-5 py-2 cursor-pointer">
            <p>DOWNLOAD</p>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-8 h-8"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-gray-300 mt-1 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-gray-300 mt-1 transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>

      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-4 space-y-4 border-t border-gray-600">
          <nav className="flex flex-col space-y-3">
            {["STORE", "FAQ", "HELP", "UNREAL ENGINE"].map((item, idx) => (
              <a
                key={idx}
                href="#"
                className="text-gray-300 hover:text-red-400 py-2"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex flex-col space-y-3 pt-3 border-t border-gray-600">
            <div className="flex items-center space-x-2 cursor-pointer py-2 hover:text-white">
              <img src="/Vector.svg" alt="Search" className="w-5 h-5" />
              <span className="text-gray-300">SEARCH</span>
            </div>

            <div className="text-gray-300 flex items-center cursor-pointer space-x-2 py-2 hover:text-white">
              <img src="/Frame.svg" alt="Sign In" className="w-5 h-5" />
              <p className="text-xs">SIGN IN</p>
            </div>

            <div className="text-sm bg-[#007AFF] hover:bg-blue-700 text-white px-4 py-2 cursor-pointer text-center rounded">
              <p>DOWNLOAD</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
