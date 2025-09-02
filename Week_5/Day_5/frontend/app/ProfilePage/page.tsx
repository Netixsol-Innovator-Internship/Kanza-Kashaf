"use client";
import { useState } from "react";
import { useGetProfileQuery } from "../../store/api";
import Navbar2 from "../components/navbars/Navbar2";
import ProfileHeader from "../components/headers/ProfileHeader";
import PersonalInfo from "../sections/PersonalInfo";
import MyCars from "../sections/MyCars";
import MyBids from "../sections/MyBids";
import Wishlist from "../sections/Wishlist";

const ProfilePage = () => {
  const { data: user, isLoading } = useGetProfileQuery();
  const [activeTab, setActiveTab] = useState("personal");

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (!user) return <div className="p-10">No user found.</div>;

  return (
    <>
      <Navbar2 />
      <ProfileHeader />
      <div className="flex max-w-[1440px] mx-auto bg-white min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 p-6">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => setActiveTab("personal")}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "personal"
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Personal Information
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("cars")}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "cars"
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                My Cars
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("bids")}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "bids"
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                My Bids
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeTab === "wishlist"
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Wishlist
              </button>
            </li>
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8">
          {activeTab === "personal" && <PersonalInfo user={user} />}
          {activeTab === "cars" && <MyCars />}        {/* ⬅️ no prop */}
          {activeTab === "bids" && <MyBids bids={user.myBids} />}
          {activeTab === "wishlist" && <Wishlist />}
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
