import { cva } from 'class-variance-authority';

export const notificationVariants = cva('rounded-lg border p-3', {
  variants: {
    action: {
      '200': 'border-green-200 bg-green-50',
      '300': 'border-red-200 bg-red-50',
      '400': 'border-orange-200 bg-orange-50',
      '100': 'border-blue-200 bg-blue-50',
    },
    isRead: {
      true: 'bg-gray-50',
      false: '',
    },
  },
  defaultVariants: {
    action: '200',
    isRead: false,
  },
});
