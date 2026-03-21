import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

var socketInstance = null;

export function getSocket() {
  if (!socketInstance) {
    var token   = useAuthStore.getState().token;
    var apiUrl  = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketInstance = io(apiUrl, {
      auth:       { token: token },
      transports: ['websocket', 'polling'], // polling fallback for Railway
    });
  }
  return socketInstance;
}