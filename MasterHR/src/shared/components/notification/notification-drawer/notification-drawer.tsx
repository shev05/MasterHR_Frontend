import { Trash2, CheckCheck } from 'lucide-react';

import { Button, ScrollArea, Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/components/ui';

import { getTypeIcon, getTypeLabel } from './notification-drawer.lib';
import { NotificationItem } from './_ui/notification-item';

import type { NotificationGroup } from '@/api/endpoints/notification';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  groups: NotificationGroup[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationDrawer = ({
  isOpen,
  onClose,
  groups,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  onClearAll,
}: NotificationDrawerProps) => {
  const hasUnread = groups.some((group) => group.unreadCount > 0);

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction='right'>
      <DrawerContent className='sm:max-w-md'>
        <DrawerHeader className='text-left'>
          <DrawerTitle className='flex items-center justify-between'>
            Уведомления
            <div className='flex gap-2'>
              {hasUnread && (
                <Button variant='outline' size='sm' onClick={onMarkAllAsRead} className='flex items-center gap-1'>
                  <CheckCheck className='h-4 w-4' />
                  Прочитать все
                </Button>
              )}
            </div>
          </DrawerTitle>
        </DrawerHeader>

        <div className='p-4'>
          <ScrollArea className='h-[calc(100vh-200px)]'>
            {groups.length === 0 ? (
              <div className='py-8 text-center text-gray-500'>Нет уведомлений</div>
            ) : (
              <div className='space-y-6'>
                {groups.map((group) => (
                  <div key={group.type} className='space-y-3'>
                    <div className='flex items-center gap-2 text-sm font-medium'>
                      {getTypeIcon(group.type)}
                      {getTypeLabel(group.type)}
                      {group.unreadCount > 0 && (
                        <span className='rounded bg-blue-100 px-2 py-1 text-xs text-blue-800'>{group.unreadCount}</span>
                      )}
                    </div>

                    <div className='space-y-2'>
                      {group.notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={onMarkAsRead}
                          onRemove={onRemove}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        <Button variant='outline' size='sm' onClick={onClearAll} className='flex items-center gap-1'>
          <Trash2 className='h-4 w-4' />
          Очистить
        </Button>
      </DrawerContent>
    </Drawer>
  );
};
