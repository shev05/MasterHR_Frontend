import { cn } from '@/shared/lib/cn';

import type { ComponentProps, FC } from 'react';
import type { SVGComponent } from '@/shared/interface';

type AppPageHeaderProps = ComponentProps<'div'> & {
  title?: string;
  icon?: SVGComponent;
};

export const AppPageHeader: FC<AppPageHeaderProps> = ({ children, title, icon: Icon, ...rest }) => {
  return (
    <div {...rest} className={cn('flex flex-wrap items-center justify-between gap-2 py-1 pe-1', rest.className)}>
      <h1 className='flex gap-2 font-bold'>
        {Icon && <Icon />}
        {title || ''}
      </h1>
      {children}
    </div>
  );
};
