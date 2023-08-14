import { io } from "socket.io-client";

const socketIo = io("http://localhost:8000");

export { socketIo };
