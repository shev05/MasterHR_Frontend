import { OctagonAlert } from 'lucide-react';
import { cloneElement, useCallback, useState } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';

import { AlertDialogContext } from './alert-dialog-context';

import type { FC, ReactNode } from 'react';
import type { AlertDialogState } from './alert-dialog-context';

type DialogProviderProps = {
  children: ReactNode;
};

export const AlertDialogProvider: FC<DialogProviderProps> = ({ children }) => {
  const [alertDialogState, setAlertDialogState] = useState<Nullable<AlertDialogState>>(null);

  const openAlertDialog = useCallback((state: AlertDialogState) => {
    setAlertDialogState((prev) => ({
      ...prev,
      ...state,
      variant: state.variant ?? 'destructive',
      isCancelBtn: state.isCancelBtn ?? true,
    }));
  }, []);

  const closeAlertDialog = useCallback(() => {
    setAlertDialogState(null);
  }, []);

  return (
    <AlertDialogContext.Provider value={{ openAlertDialog, closeAlertDialog }}>
      {children}

      {!!alertDialogState && (
        <AlertDialog open={!!alertDialogState} onOpenChange={closeAlertDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className='flex gap-2'>
                <OctagonAlert
                  className={cn(
                    'fill-destructive/10 mt-1 size-5 shrink-0',
                    alertDialogState.variant === 'destructive' && 'text-destructive'
                  )}
                />
                <div className='flex flex-col gap-2'>
                  {alertDialogState?.title && <AlertDialogTitle>{alertDialogState?.title}</AlertDialogTitle>}
                  {alertDialogState?.desctition && (
                    <AlertDialogDescription>{alertDialogState?.desctition}</AlertDialogDescription>
                  )}
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {alertDialogState?.isCancelBtn && <AlertDialogCancel>Отмена</AlertDialogCancel>}
              {alertDialogState?.buttons?.map((button, index) => {
                const originalOnClick = button.props.onClick;

                const combinedOnClick = () => {
                  if (typeof originalOnClick === 'function') {
                    originalOnClick();
                  }
                  closeAlertDialog();
                };

                return cloneElement(button, {
                  key: index,
                  onClick: combinedOnClick,
                });
              })}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AlertDialogContext.Provider>
  );
};
