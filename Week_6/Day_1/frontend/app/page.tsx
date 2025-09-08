import Hero from './components/Hero';
import dynamic from "next/dynamic";
import BrowseByStyle from './components/BrowseByStyle';
import Reviews from './components/Reviews';

const NewArrivals = dynamic(() => import("./components/NewArrivals"), { ssr: false });
const TopSelling = dynamic(() => import("./components/TopSelling"), { ssr: false });

export default function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <TopSelling />
      <BrowseByStyle />
      <Reviews />
    </>
  );
}