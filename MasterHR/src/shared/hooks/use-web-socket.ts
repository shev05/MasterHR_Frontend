import { useEffect, useState } from 'react';
import useReactWebSocket from 'react-use-websocket';

interface WebSocketMessage {
  type: string;
  action: string;
  itemId: string;
  message: string;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  messages: WebSocketMessage[];
  sendMessage: (message: WebSocketMessage) => void;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
  const { sendMessage, lastMessage, readyState } = useReactWebSocket(url, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    share: true,
  });

  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data: WebSocketMessage = JSON.parse(lastMessage.data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);

  const isConnected = readyState === WebSocket.OPEN;

  const sendMessageWrapper = (message: WebSocketMessage) => {
    sendMessage(JSON.stringify(message));
  };

  return {
    isConnected,
    messages,
    sendMessage: sendMessageWrapper,
  };
};
