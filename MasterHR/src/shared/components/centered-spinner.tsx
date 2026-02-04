import { cn } from '@/shared/lib/cn';

import { Spinner } from './ui';

import type { FC } from 'react';
import type { SpinnerProps } from './ui';

type TCenteredSpinnerProps = SpinnerProps & {
  className?: string;
};

export const CenteredSpinner: FC<TCenteredSpinnerProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'backdrop-blur-xs absolute inset-0 z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-lg',
        className
      )}
    >
      <Spinner {...props} />
    </div>
  );
};
