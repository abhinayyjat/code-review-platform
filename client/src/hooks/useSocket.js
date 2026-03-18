import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

var socketInstance = null;

export function getSocket() {
  if (!socketInstance) {
    var token = useAuthStore.getState().token;
    socketInstance = io('http://localhost:5000', {
      auth: { token: token },
      transports: ['websocket'],
    });
  }
  return socketInstance;
}

export function useSocket() {
  var socketRef = useRef(null);

  useEffect(function() {
    socketRef.current = getSocket();
    return function() {
      // Don't disconnect on unmount — keep persistent connection
    };
  }, []);

  return socketRef.current;
}
