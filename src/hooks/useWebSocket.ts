import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface WebSocketMessage {
  type: 'activity' | 'sync_complete' | 'error';
  data: any;
}

export const useActivityWebSocket = (enabled: boolean = true) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!enabled) return;

    // Get base URL from config and convert to WebSocket URL
    const baseURL = localStorage.getItem('timewise_config');
    let wsURL = 'ws://localhost:3000/ws/activities';
    
    if (baseURL) {
      try {
        const config = JSON.parse(baseURL);
        const httpURL = config.API_BASE_URL || 'http://localhost:3000/api';
        wsURL = httpURL.replace('http://', 'ws://').replace('https://', 'wss://').replace('/api', '/ws/activities');
      } catch (e) {
        console.error('Failed to parse config for WebSocket URL', e);
      }
    }

    try {
      const ws = new WebSocket(wsURL);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case 'activity':
              // New activity captured
              toast({
                title: "New activity captured",
                description: `${message.data.appName}: ${message.data.windowTitle}`,
              });
              // Invalidate activities query to refetch
              queryClient.invalidateQueries({ queryKey: ['activities'] });
              break;

            case 'sync_complete':
              toast({
                title: "Sync complete",
                description: `${message.data.count} activities synchronized.`,
              });
              queryClient.invalidateQueries({ queryKey: ['activities'] });
              break;

            case 'error':
              console.error('WebSocket error message:', message.data);
              break;
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message', e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connect();
        }, 5000);
      };

      wsRef.current = ws;
    } catch (e) {
      console.error('Failed to create WebSocket connection', e);
    }
  }, [enabled, toast, queryClient]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    reconnect: connect,
  };
};
