import { CircleX } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

import type { ComponentProps, FC } from 'react';

type ErrorBoundaryFallbackProps = ComponentProps<'div'> & { text?: string };

export const ErrorBoundaryFallback: FC<ErrorBoundaryFallbackProps> = ({ text = 'Произошла ошибка', ...rest }) => {
  return (
    <div
      {...rest}
      className={cn(
        'text-destructive border-destructive flex items-center justify-center gap-2 rounded border p-5 text-xs',
        rest.className
      )}
    >
      <CircleX className='size-10' />
      <div className='flex flex-col items-start'>
        <p className='flex gap-2 text-sm font-semibold'>{text}</p>
        <p>Обратитесь к разработчикам</p>
      </div>
    </div>
  );
};
