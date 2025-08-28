import './globals.css'
import { Providers } from '../lib/Providers'
import { Toaster } from 'react-hot-toast'

export const metadata = { title: 'Realtime Comments', description: 'Socket.IO + RTK Query' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
