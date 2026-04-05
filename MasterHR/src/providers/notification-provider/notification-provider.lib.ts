import { createContext } from 'react'

import type { useNotifications } from '@/shared/hooks/use-notification'

const defaultNotifications: ReturnType<typeof useNotifications> = {
  notifications: [],
  groupedNotifications: [],
  unreadCount: 0,
  isDrawerOpen: false,
  setIsDrawerOpen: () => {},
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
  clearAll: () => {},
}

export const NotificationContext = createContext<ReturnType<typeof useNotifications>>(defaultNotifications)
