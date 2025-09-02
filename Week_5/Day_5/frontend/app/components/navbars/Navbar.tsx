// components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-[#24347D] text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px] flex justify-between items-center h-[50px] text-[14px] leading-[20px]">
          {/* Phone */}
          <div className="flex items-center space-x-2">
            <span>Call Us &nbsp; 570-694-4002</span>
          </div>
          {/* Email */}
          <div className="flex items-center space-x-2">
            <Mail size={16} strokeWidth={2} />
            <span>
              Email Id :{" "}
              <Link
                href="mailto:info@cardeposit.com"
                className="underline hover:text-gray-200"
              >
                info@cardeposit.com
              </Link>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
