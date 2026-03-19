import { ChevronDown, Funnel, FunnelX } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/shared/lib/cn';

import { Badge, Button, Collapsible, CollapsibleContent, SuspenseWrapper } from './ui';

import type { FC, JSX, ReactNode } from 'react';

type FiltersBadgeProps = {
  appliedFiltersCount: number;
};

export const FiltersBadge: FC<FiltersBadgeProps> = ({ appliedFiltersCount }) => {
  return (
    <SuspenseWrapper condition={!!appliedFiltersCount}>
      <Badge className='border-border absolute right-0 top-0 aspect-square size-4 -translate-y-1/2 translate-x-1/2 rounded-full p-0 font-mono text-[7px] font-bold tabular-nums'>
        {appliedFiltersCount > 10 ? '9+' : appliedFiltersCount}
      </Badge>
    </SuspenseWrapper>
  );
};

export type AppFiltersContainerProps = {
  children?: ReactNode;
  firstLevelFilters: JSX.Element;
  onFiltersReset: () => void;
  defaultOpen?: boolean;
} & FiltersBadgeProps;

export const AppFiltersContainer: FC<AppFiltersContainerProps> = ({
  children,
  firstLevelFilters,
  appliedFiltersCount,
  onFiltersReset,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <div className='flex flex-wrap items-end gap-2 sm:flex-nowrap'>
        {firstLevelFilters}
        {children ? (
          <Button size={'lg'} variant='secondary' className={'rounded-lg'} onClick={() => setOpen((prev) => !prev)}>
            <div className='relative'>
              <FiltersBadge appliedFiltersCount={appliedFiltersCount} />
              <Funnel />
            </div>
            Фильтры
            <ChevronDown className={cn('transition-rotate size-4 duration-300', open && 'rotate-180')} />
          </Button>
        ) : (
          <Button variant={'outline'} className='border-primary text-primary w-fit' onClick={onFiltersReset}>
            <div className='relative'>
              <FiltersBadge appliedFiltersCount={appliedFiltersCount} />
              <Funnel />
            </div>
            Cбросить
          </Button>
        )}
      </div>
      <Collapsible className='min-h-unset w-full' open={open}>
        <CollapsibleContent>
          <div className='flex auto-rows-min grid-cols-[repeat(auto-fill,minmax(300px,1fr))] flex-wrap items-end gap-1.5 p-0.5 md:grid'>
            {children}
            <SuspenseWrapper condition={!!children}>
              <Button variant={'outline'} className='border-primary text-primary w-fit' onClick={onFiltersReset}>
                <FunnelX />
                Cбросить
              </Button>
            </SuspenseWrapper>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
