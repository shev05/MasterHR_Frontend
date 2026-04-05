import { Bell } from 'lucide-react'

import { Button, Badge } from '@/shared/components/ui'

interface INotificationBellProps {
  unreadCount: number
  onClick: () => void
}

export const NotificationBell = ({ unreadCount, onClick }: INotificationBellProps) => {
  return (
    <Button
      variant='ghost'
      size='icon'
      className='relative hover:cursor-pointer'
      onClick={onClick}
    >
      <Bell className='h-5 w-5' />
      {unreadCount > 0 && (
        <Badge
          variant='destructive'
          className='absolute -right-0 -top-0 flex h-4 w-4 items-center justify-center p-0 text-xs'
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  )
}
