"use client";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#F0F0F0] mt-40">
      {/* Newsletter Banner */}
      <div className="bg-black text-white rounded-[20px] mx-4 md:mx-12 lg:mx-24 xl:mx-36 3xl:mx-72 -translate-y-12 px-6 md:px-12 lg:px-24 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <h2 className="text-2xl md:text-3xl font-extrabold leading-snug max-w-lg">
          STAY UPTO DATE ABOUT <br /> OUR LATEST OFFERS
        </h2>
        <div className="flex flex-col gap-4 w-full md:w-[400px]">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3">
            <Image
                src="/email.png"
                alt="email"
                width={20}
                height={20}
            />
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 outline-none text-black placeholder-gray-500"
            />
          </div>
          <button className="bg-white text-black font-medium rounded-full py-3 hover:bg-gray-200 transition">
            Subscribe to Newsletter
          </button>
        </div>
      </div>

      {/* Footer Main */}
      <div className="px-6 md:px-12 lg:px-24 xl:px-36 3xl:px-72">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-10 border-b border-gray-300">
          {/* Logo & About */}
          <div className="space-y-4 md:col-span-1">
            <h1 className="text-2xl font-extrabold">SHOP.CO</h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              We have clothes that suits your style and which you’re proud to
              wear. From women to men.
            </p>
            <div className="flex gap-3 mt-4">
            {["twitter", "facebook", "instagram", "github"].map((icon) => (
                <div
                key={icon}
                className={`w-9 h-9 rounded-full shadow flex items-center justify-center 
                    ${icon === "facebook" ? "bg-black" : "bg-white"} 
                    hover:bg-gray-100 transition`}
                >
                <img
                    src={`/${icon}.png`}
                    alt={icon}
                    className="w-4 h-4"
                />
                </div>
            ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-sm mb-4">COMPANY</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>About</li>
              <li>Features</li>
              <li>Works</li>
              <li>Career</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-4">HELP</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>Customer Support</li>
              <li>Delivery Details</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-4">FAQ</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>Account</li>
              <li>Manage Deliveries</li>
              <li>Orders</li>
              <li>Payments</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-4">RESOURCES</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>Free eBooks</li>
              <li>Development Tutorial</li>
              <li>How to - Blog</li>
              <li>Youtube Playlist</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-6 pt-4 text-sm text-gray-500 gap-4">
          <p>Shop.co © 2000-2023, All Rights Reserved</p>
          <div className="flex">
            <img src="/visa.png" alt="Visa" className="h-10" />
            <img src="/mastercard.png" alt="Mastercard" className="h-10" />
            <img src="/paypal.png" alt="Paypal" className="h-10" />
            <img src="/applepay.png" alt="Apple Pay" className="h-10" />
            <img src="/googlepay.png" alt="Google Pay" className="h-10" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
