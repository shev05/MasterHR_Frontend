import { createContext } from 'react';

import type { JSX } from 'react';

export type TShowDialogProps = {
  className?: string;
  getContent: (onClose: () => void) => JSX.Element;
};

export type DialogContextValue = {
  showDialog: ({ className, getContent }: TShowDialogProps) => void;
  closeDialog: () => void;
};

export const DialogContext = createContext<Nullable<DialogContextValue>>(null);
