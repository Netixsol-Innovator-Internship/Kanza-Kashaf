'use client'
import { io } from 'socket.io-client'

const URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

// Create socket but don't auto-connect. We will connect after login.
export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket'],
  auth: { token: getToken() },
})

// Connect socket (use after login). Will set auth then connect.
export function connectSocket() {
  try {
    socket.auth = { token: getToken() }
    if (socket.connected) {
      // if already connected, reconnect to refresh auth
      socket.disconnect()
    }
    socket.connect()
  } catch (e) {
    // ignore
  }
}

// Gracefully disconnect the socket and clear its auth token.
// Useful when logging out so the server no longer sees this socket as authenticated.
export function logoutSocket() {
  try {
    socket.auth = {}
    socket.disconnect()
  } catch (e) {
    // ignore
  }
}

// Refresh socket auth and reconnect (alias)
export function refreshSocketAuth() {
  connectSocket()
}
