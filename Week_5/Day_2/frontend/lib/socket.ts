import { io, Socket } from 'socket.io-client';
export let socket: Socket | null = null;
export function initSocket(token: string) {
  if (socket) return socket;
  socket = io(process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000', {
    transports: ['websocket'],
    auth: { token }
  });
  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });
  return socket;
}