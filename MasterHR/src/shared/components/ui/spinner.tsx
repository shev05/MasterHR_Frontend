import { LoaderIcon } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

export type SpinnerProps = React.ComponentProps<'svg'>;

function Spinner({ className, ...props }: SpinnerProps) {
  return <LoaderIcon role='status' aria-label='Loading' className={cn('size-4 animate-spin', className)} {...props} />;
}

export { Spinner };
