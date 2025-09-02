'use client'

import { Provider } from 'react-redux'
import { store } from '../../store/store'
import SocketListener from '../components/SocketListener'
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
