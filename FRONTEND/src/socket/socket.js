import { io } from "socket.io-client";

// your backend URL
const URL = import.meta.env.VITE_BACKEND_URL;

// initialize and export the Socket.IO client with the backend URL and CORS settings
export const socket = io(URL, {
    withCredentials: true,
});