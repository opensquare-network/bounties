import io from "socket.io-client";

export let socket = null;

export function connect() {
  if (socket) {
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_APP_SOCKET_IO_URL);
  socket.connect();

  return socket;
}
