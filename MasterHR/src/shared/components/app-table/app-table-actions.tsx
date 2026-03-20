import { useMemo } from 'react';
import { Check, Eye, Pencil, Trash2 } from 'lucide-react';

import { Button, Tooltip, TooltipContent, TooltipPositioner, TooltipTrigger } from '@/shared/components/ui';
import { useAlertDialog } from '@/providers/alert-dialog-provider';

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
  const { openAlertDialog } = useAlertDialog();

  const rowActions = useMemo(() => {
    return Object.entries(actions).reduce<Record<string, () => void>>((acc, [key, handler]) => {
      if (handler) {
        acc[key] = () => handler(row);
      }
      return acc;
    }, {});
  }, [actions, row]);

  const handleButtonDelete = () =>
    openAlertDialog({
      variant: 'destructive',
      title: 'Удаление',
      desctition: 'Это действие невозможно отменить. Подтвердите удаление !',
      buttons: [
        <Button onClick={rowActions.onDelete} variant={'destructive'}>
          Удалить
        </Button>,
      ],
    });

  const handleButtonAccept = () =>
    openAlertDialog({
      variant: 'warning',
      title: 'Принять',
      desctition: 'Это действие невозможно отменить. Подтвердите принятие !',
      buttons: [
        <Button onClick={rowActions.onAccept} variant={'default'}>
          Принять
        </Button>,
      ],
    });

  const ACTIONS_SCHEMA = [
    { action: rowActions.onView, icon: <Eye />, description: 'Просмотр' },
    { action: rowActions.onEdit, icon: <Pencil />, description: 'Редактирование' },
    {
      action: rowActions.onDelete ? handleButtonDelete : undefined,
      icon: <Trash2 className='text-destructive' />,
      description: 'Удаление',
    },
    {
      action: rowActions.onAccept ? handleButtonAccept : undefined,
      icon: <Check className='text-green-400' />,
      description: 'Принять',
    },
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
