'use client'
import { Catalog } from "@/components/Catalog";
import Footer from "@/components/Footer";
import { FreeGames } from "@/components/FreeGames";
import { GameSlider } from "@/components/GameSlider";
import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchBar from "@/components/SearchBar";
import { ThreeGamesCard } from "@/components/ThreeGames";
import { TopGames } from "@/components/TopSellers";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [data, setData] = useState({free:[], top:[], featured:[], sale:[]});

  useEffect(() => {
    async function go(){
      try{
        const [freeRes, topRes, featRes, saleRes] = await Promise.all([
          fetch("/api/free-games"),
          fetch("/api/top-sellers"),
          fetch("/api/featured"),
          fetch("/api/sale-games"),
        ]);
        const [free, top, featured, sale] = await Promise.all([freeRes.json(), topRes.json(), featRes.json(), saleRes.json()]);
        setData({free, top, featured, sale});
      }catch(e){
        console.error(e);
      }
    }
    go();
  }, []);

  return (
    <>
      <main className="w-full  bg-black">
          <Header />
        <div className="max-w-[1200px] mx-auto ">
          <SearchBar />
          <HeroSection />
          <GameSlider />
          <ThreeGamesCard />
          <FreeGames />
          <TopGames />
          <ThreeGamesCard />
          <GameSlider />
          <Catalog />
        </div>
        <Footer />
      </main>
    </>
  );
}