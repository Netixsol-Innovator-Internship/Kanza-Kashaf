'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import NotificationsBell from './NotificationsBell';
import { useGetProfileQuery, useLogoutMutation, api } from '../../store/api';
import { useDispatch } from 'react-redux';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: user } = useGetProfileQuery(); // simple query, no polling

  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutMutation({ refreshToken }).unwrap();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      // 👇 Clear RTK Query cache to update profile
      dispatch(api.util.resetApiState());

      // Inform same-tab listeners and reset notifications without reload
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-changed'));

      router.push('/');
    }
  };

  const onClick = (styleKey: string) => {
    router.push(`/products?styles=${encodeURIComponent(styleKey)}`);
    setShopDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full border-b relative">
      {/* Top Banner */}
      {showBanner && !user && (
        <div className="bg-black text-white text-center text-sm py-2 flex justify-center items-center relative">
          <p>
            Sign up and get 20% off to your first order.{' '}
            <a href="/signup" className="underline font-medium">
              Sign Up Now
            </a>
          </p>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-2 text-white hover:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav className="w-full px-4 lg:px-12 py-4 flex items-center justify-between">
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={28} />
          </button>

          {/* Logo */}
          <a href="/" className="text-2xl font-bold tracking-tight">
            SHOP.CO
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            <li className="relative">
              <button
                onClick={() => setShopDropdown(!shopDropdown)}
                className="flex items-center gap-1 hover:text-black"
              >
                Shop <ChevronDown size={16} />
              </button>
              {shopDropdown && (
                <ul className="absolute top-8 left-0 bg-white border shadow-md rounded-md text-sm py-2 w-40">
                  {['casual', 'formal', 'party', 'gym'].map((style) => (
                    <li key={style}>
                      <button
                        onClick={() => onClick(style)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {style.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li><a href="/sale" className="hover:text-black">On Sale</a></li>
            <li><a href="/new-arrivals" className="hover:text-black">New Arrivals</a></li>
            <li><a href="/products" className="hover:text-black">Brands</a></li>
          </ul>
        </div>

        {/* Center Search */}
        <div className="hidden lg:flex flex-1 justify-center max-w-lg px-6">
          <div className="flex items-center bg-gray-100 rounded-full px-3 w-full">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              className="bg-transparent w-full px-2 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Search + Cart + Profile */}
        <div className="flex items-center md:gap-4 gap-2">
          {/* Mobile search */}
          <button className="lg:hidden">
            <Search size={24} className="text-gray-600" />
          </button>

          {/* Notifications */}
          <NotificationsBell />

          {/* Cart */}
          <Link href="/cart" className="hover:text-black">
            <Image src="/cart.png" alt="cart" width={25} height={25} />
          </Link>

          {/* Profile */}
          {user ? (
            <div className="relative group">
              <Link href="/profile" className="hover:text-black">
                <Image src="/profile.png" alt="profile" width={25} height={25} />
              </Link>
              <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  Hello, {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hover:text-black">
              <Image src="/profile.png" alt="login" width={25} height={25} />
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-md absolute left-0 right-0 z-50">
          <ul className="flex flex-col text-sm font-medium text-gray-700 p-4 space-y-4">
            <li>
              <button
                onClick={() => setShopDropdown(!shopDropdown)}
                className="flex items-center gap-1 w-full justify-between"
              >
                Shop <ChevronDown size={16} />
              </button>
              {shopDropdown && (
                <ul className="pl-4 mt-2 space-y-2 text-gray-600">
                  {['casual', 'formal', 'party', 'gym'].map((style) => (
                    <li key={style}>
                      <button
                        onClick={() => onClick(style)}
                        className="block w-full text-left hover:text-black"
                      >
                        {style.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li><a href="/sale" className="hover:text-black">On Sale</a></li>
            <li><a href="/new-arrivals" className="hover:text-black">New Arrivals</a></li>
            <li><a href="/products" className="hover:text-black">Brands</a></li>
          </ul>
        </div>
      )}
    </header>
  );
}
