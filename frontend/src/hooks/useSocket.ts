import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

interface Metrics {
  livesSaved: number;
  donorsOnline: number;
  avgTimeToBlood: number;
  activeEmergencies: number;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    livesSaved: 0,
    donorsOnline: 0,
    avgTimeToBlood: 0,
    activeEmergencies: 0,
  });
  const [alert, setAlert] = useState<any>(null);

  useEffect(() => {
    socketRef.current = io(WS_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setConnected(true);
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('WebSocket disconnected');
    });

    socket.on('metrics', (data: Metrics) => {
      setMetrics(data);
    });

    socket.on('alert', (data: any) => {
      setAlert(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendAlert = useCallback((data: any) => {
    socketRef.current?.emit('alert', data);
  }, []);

  const acceptAlert = useCallback((data: any) => {
    socketRef.current?.emit('accept', data);
  }, []);

  const updateLocation = useCallback((data: any) => {
    socketRef.current?.emit('location', data);
  }, []);

  return {
    connected,
    metrics,
    alert,
    sendAlert,
    acceptAlert,
    updateLocation,
  };
}