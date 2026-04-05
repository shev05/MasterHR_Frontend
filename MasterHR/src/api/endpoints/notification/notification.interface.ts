export type NotificationItem = {
  title: string;
  message: string;
  code: number;
  id: string;
  isRead: boolean;
};

export type NotificationGroup = {
  type: string;
  notifications: NotificationItem[];
  unreadCount: number;
};
