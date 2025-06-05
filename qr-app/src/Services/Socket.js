// import { io } from 'socket.io-client';

import { io } from "socket.io-client";
const URL =
  import.meta.env.VITE_MODE === "Production"
    ? import.meta.env.VITE_BACKEND_PROD
    : import.meta.env.VITE_BACKEND_DEV;

export const socket = io(URL);
