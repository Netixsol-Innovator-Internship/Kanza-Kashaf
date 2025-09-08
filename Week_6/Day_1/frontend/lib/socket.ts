// frontend/lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null;
  if (socket && socket.connected) return socket;
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  socket = io(url, {
    transports: ['websocket'],
    auth: { token },
    autoConnect: true,
  });
  socket.on('connect_error', (err) => {
    console.error('[socket] connect_error', err?.message || err);
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    try { socket.disconnect(); } catch {}
    socket = null;
  }
}

