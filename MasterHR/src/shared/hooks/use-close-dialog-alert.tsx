import { useCallback } from 'react';

import { Button } from '@/shared/components/ui';
import { useAlertDialog } from '@/providers/alert-dialog-provider';

import type { AlertDialogState } from '@/providers/alert-dialog-provider';

type CloseDialogAlertProps = AlertDialogState & {
  onSave: () => void;
  onDismiss: () => void;
};

export const useCloseDialogAlert = () => {
  const { openAlertDialog } = useAlertDialog();

  const openCloseDialogAlert = useCallback(
    ({
      variant = 'destructive',
      title = 'Сохранить?',
      desctition = 'Вы забыли сохранить. Продолжить?',
      onSave = () => {},
      onDismiss = () => {},
    }: CloseDialogAlertProps) => {
      openAlertDialog({
        variant,
        title,
        desctition,
        buttons: [
          <Button variant='destructive' onClick={onDismiss}>
            Не сохранять
          </Button>,
          <Button onClick={onSave}>Cохранять</Button>,
        ],
      });
    },
    [openAlertDialog]
  );

  return { openCloseDialogAlert };
};
