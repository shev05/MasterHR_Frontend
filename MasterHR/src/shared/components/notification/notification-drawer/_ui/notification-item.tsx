import { CheckCircle2, Trash2 } from 'lucide-react';

import { badgeVariants, Button } from '@/shared/components/ui';

import { notificationVariants } from './notification-item.lib';

import type { NotificationItem as Not } from '@/api/endpoints/notification';

interface NotificationItemProps {
  notification: Not;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead, onRemove }: NotificationItemProps) => {
  // const action = '200';

  return (
    <div
      className={notificationVariants({
        action: '300',
        isRead: true,
      })}
    >
      <div className='mb-2 flex items-start justify-between'>
        <div className='flex items-center gap-2'>
          <span
            className={badgeVariants({
              variant: 'default',
            })}
          >
            {notification.title}
          </span>
          <div className='h-2 w-2 rounded-full bg-blue-500' />
        </div>
        <div className='flex gap-1'>
          <Button size='icon' className='h-6 w-6' onClick={() => onMarkAsRead(notification.id)}>
            <CheckCircle2 className='h-3 w-3' />
          </Button>

          <Button size='icon' className='h-6 w-6' onClick={() => onRemove(notification.id)}>
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
      </div>
      <p className='mb-1 text-sm dark:text-black'>{notification.message}</p>
      <p className='text-xs text-gray-500'>{new Date(notification.code).toLocaleString('ru-RU')}</p>
    </div>
  );
};
