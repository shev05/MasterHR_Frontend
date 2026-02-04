import { useMemo } from 'react';
import { Eye, Pencil } from 'lucide-react';

import { Button, Tooltip, TooltipTrigger, TooltipPositioner, TooltipContent } from '@/shared/components';

import type { BaseGetColumnsProps } from '@/shared/interface';

export const BASE_ACTION_CELL_CONFIG = {
  id: 'action',
  meta: {
    style: { textAlign: 'right' },
  },
  size: 10,
  minSize: 10,
} as const;

type TableActionsPopoverProps<T> = BaseGetColumnsProps<T> & { row: T };

export const TableActions = <T,>({ row, ...actions }: TableActionsPopoverProps<T>) => {
  const rowActions = useMemo(() => {
    return Object.entries(actions).reduce<Record<string, () => void>>((acc, [key, handler]) => {
      if (handler) {
        acc[key] = () => handler(row);
      }
      return acc;
    }, {});
  }, [actions, row]);

  const ACTIONS_SCHEMA = [
    { action: rowActions.onView, icon: <Eye />, description: 'Просмотр' },
    { action: rowActions.onEdit, icon: <Pencil />, description: 'Редактирование' },
  ].filter((item) => item.action !== undefined);

  if (ACTIONS_SCHEMA.length === 0) return null;

  return (
    <div className='flex w-fit'>
      {ACTIONS_SCHEMA.map((item, index) => {
        return (
          <Tooltip key={index}>
            <TooltipTrigger
              render={
                <Button size={'icon-sm'} variant={'ghost'} onClick={item.action}>
                  {item.icon}
                </Button>
              }
            />
            <TooltipPositioner>
              <TooltipContent>{item.description}</TooltipContent>
            </TooltipPositioner>
          </Tooltip>
        );
      })}
    </div>
  );
};
