import { cn } from '@/shared/lib/cn';

import type { FC, ReactNode } from 'react';

type TConditionalWrapperProps = {
  condition?: boolean;
  children: ReactNode;
  className?: string;
  animated?: boolean;
};

//TODO: add animation classes if need
const ConditionalWrapper: FC<TConditionalWrapperProps> = ({ condition, children, className, animated = false }) => {
  return animated ? (
    <div className={cn('hidden h-full', condition && 'block', className)}>{children}</div>
  ) : (
    condition && <>{children}</>
  );
};

type TSuspenseWrapperProps = TConditionalWrapperProps & { fallback?: ReactNode };

export const SuspenseWrapper: FC<TSuspenseWrapperProps> = ({ children, condition, fallback, className, animated }) => {
  return condition && fallback ? (
    <>
      {fallback}
      {children}
    </>
  ) : (
    <ConditionalWrapper animated={animated} className={className} condition={fallback ? !condition : condition}>
      {children}
    </ConditionalWrapper>
  );
};
