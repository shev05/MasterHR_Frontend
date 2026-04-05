import React, { useEffect } from 'react';

import { useSignalR } from '@/shared/hooks/use-signalr';
import { NotificationDrawer } from '@/shared/components/notification';
import { useNotificationManager } from '@/shared/hooks/use-notification-manager';

import { NotificationContext } from './notification-provider.lib';

interface NotificationProviderProps {
  children?: React.ReactNode;
  websocketUrl: string;
}

export const NotificationProvider = ({ children, websocketUrl }: NotificationProviderProps) => {
  const { messages, isConnected, setMessages } = useSignalR(websocketUrl);

  const notificationManager = useNotificationManager();

  const {
    isDrawerOpen,
    setIsDrawerOpen,
    groupedNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = notificationManager;

  useEffect(() => {
    messages.forEach((message) => {
      if (message.message) {
        addNotification({
          id: message.id,
          code: Number(message.code),
          message: message.message,
          title: message.title,
        });
      }
    });
    if (messages.length) setMessages([]);
  }, [messages]);

  return (
    <NotificationContext.Provider value={notificationManager}>
      {children}

      {!isConnected && (
        <div className='fixed bottom-4 right-4 z-50 rounded bg-yellow-100 px-3 py-1 text-xs text-yellow-800'>
          Переподключение к серверу...
        </div>
      )}

      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        groups={groupedNotifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onRemove={removeNotification}
        onClearAll={clearAll}
      />
    </NotificationContext.Provider>
  );
};
