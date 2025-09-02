'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import LiveAuction from './components/LiveAuction'
import HeroSection from './components/HeroSection'
import Navbar3 from './components/navbars/Navbar3'

export default function Home() {
  return (
    <>
      <Navbar3 />
      <HeroSection />
      <LiveAuction />
    </>
  )
}