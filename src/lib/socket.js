// src/lib/socket.ts
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

let socket = null;

export function connectSocket() {
  if (socket && socket.connected) return socket;
  socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    auth: () => ({ token: localStorage.getItem("auth_token") }),
  });
  socket.on("connect", () => console.log("Socket connected", socket?.id));
  socket.on("disconnect", () => console.log("Socket disconnected"));
  socket.connect();
  return socket;
}

export function getSocket() {
  return socket;
}

export default connectSocket;

