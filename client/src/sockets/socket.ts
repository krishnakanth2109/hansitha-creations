import { io, Socket } from "socket.io-client";

let socket: Socket;

// Auto-select backend URL depending on environment
const SOCKET_URL = import.meta.env.PROD
  ? "wss://hansitha-web-backend.onrender.com"
  : "http://localhost:3000";

export const connectSocket = () => {
  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("🟢 WebSocket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 WebSocket disconnected");
  });
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket not connected. Call connectSocket() first.");
  }
  return socket;
};
