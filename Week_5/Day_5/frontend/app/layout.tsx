import './globals.css'
import { Providers } from '../store/providers' // updated to match the provider file path
import Footer from './components/Footer'
import Navbar from './components/navbars/Navbar'
export const metadata = {
  title: 'Realtime Auctions',
  description: 'Auction app frontend',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Providers>
            {children}
        </Providers>
        <Footer />
      </body>
    </html>
  )
}
