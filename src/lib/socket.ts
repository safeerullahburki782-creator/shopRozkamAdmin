import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string): Socket => {
  if (!socket) {
    socket = io("http://192.168.200.46:7001", {
      query: { token },
      transports: ["websocket"],
    });
  }

  return socket;
};
