import { createContext } from 'react';

import type { JSX, ReactNode } from 'react';

export type AlertDialogState = {
  title?: string;
  desctition?: ReactNode | string;
  isCancelBtn?: boolean;
  buttons?: JSX.Element[];
  variant?: 'destructive' | 'warning';
};

export const AlertDialogContext = createContext({
  openAlertDialog: (_: AlertDialogState) => {},
  closeAlertDialog: () => {},
});
