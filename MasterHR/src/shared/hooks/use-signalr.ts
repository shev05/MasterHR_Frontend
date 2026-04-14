import { useEffect, useState, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

interface NotificationMessage {
  title: string;
  message: string;
  code: number;
  id: string;
}

export const useSignalR = (url: string) => {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!url) return;

    const connection = new HubConnectionBuilder()
      .withUrl(url, {
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;

    const startConnection = async () => {
      try {
        await connection.start();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);

        setTimeout(() => {
          if (connection.state === 'Disconnected') {
            startConnection();
          }
        }, 50000);
      }
    };

    connection.on('ReceiveNotification', (notification: NotificationMessage) => {
      const formattedMessage = {
        code: notification.code,
        id: notification.id,
        message: notification.message,
        title: notification.title,
      };

      setMessages((prev) => [...prev, formattedMessage]);
    });

    connection.on('Connect', () => {
      setIsConnected(true);
    });

    connection.on('Disconnect', () => {
      setIsConnected(false);
    });
    connection.onreconnecting(() => {
      setIsConnected(false);
    });

    connection.onreconnected(() => {
      setIsConnected(true);
    });

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [url]);

  return {
    messages,
    isConnected,
    connection: connectionRef.current,
    setMessages,
  };
};
