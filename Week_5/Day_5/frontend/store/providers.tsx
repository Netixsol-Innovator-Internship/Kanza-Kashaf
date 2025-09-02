'use client'

import { Provider } from 'react-redux'
import { store } from './store' // adjust path if your store file is located elsewhere
import SocketListener from '../app/components/SocketListener' // matches your earlier placement
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* Toast system */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Global socket listener */}
      <SocketListener />

      {children}
    </Provider>
  )
}
