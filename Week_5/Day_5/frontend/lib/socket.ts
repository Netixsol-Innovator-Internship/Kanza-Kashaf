// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const defaultSocketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (typeof apiUrl === 'string' ? apiUrl.replace(/\/api\/v\d+$/, '') : 'http://localhost:4000');

export const socket: Socket = io(defaultSocketUrl, {
  autoConnect: false,
  // Reconnection is handled by socket.io client defaults
});

// Connect with token (sets auth before connecting)
export function connectSocket(token: string) {
  if (!token) return;
  if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
}

// Generic subscribe helper retained for specialized components
export function subscribeToAuctionUpdates(callback: (data: any) => void) {
  if (!socket.connected) {
    socket.connect();
  }

  // These are the events emitted by your server (see ws.gateway.ts)
  socket.on('auction_started', (payload) => callback({ event: 'auction_started', payload }));
  socket.on('new_bid', (payload) => callback({ event: 'new_bid', payload }));
  socket.on('auction_ended', (payload) => callback({ event: 'auction_ended', payload }));
  socket.on('auction_won', (payload) => callback({ event: 'auction_won', payload }));
  socket.on('wishlist_updated', (payload) => callback({ event: 'wishlist_updated', payload }));
  // keep 'auction_update' if your server uses it
  socket.on('auction_update', (payload) => callback({ event: 'auction_update', payload }));
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}
