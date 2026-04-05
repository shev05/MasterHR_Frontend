import { useCallback, useMemo, useState } from 'react';

import type { NotificationGroup, NotificationItem } from '@/api/endpoints/notification';

export const useNotificationManager = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addNotification = useCallback((data: Omit<NotificationItem, 'timestamp' | 'isRead'>) => {
    setNotifications((prev) => {
      const isDuplicate = prev.some((notification) => notification.id === data.id);

      if (isDuplicate) {
        return prev;
      }

      const newNotification: NotificationItem = {
        ...data,
        isRead: false,
      };

      return [newNotification, ...prev];
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const groupedNotifications = useMemo((): NotificationGroup[] => {
    const groups: { [key: string]: NotificationItem[] } = {};

    notifications.forEach((notification) => {
      if (!groups[notification.code]) {
        groups[notification.code] = [];
      }
      groups[notification.code].push(notification);
    });

    return Object.entries(groups).map(([type, notifications]) => ({
      type,
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }));
  }, [notifications]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  return {
    notifications,
    groupedNotifications,
    unreadCount,
    isDrawerOpen,
    setIsDrawerOpen,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
};
