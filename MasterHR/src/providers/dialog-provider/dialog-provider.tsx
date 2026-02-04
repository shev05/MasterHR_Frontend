import { useCallback, useState } from 'react';

import { DialogContext } from './dialog-context';

import type { FC, JSX, ReactNode } from 'react';
import type { TShowDialogProps } from './dialog-context';

export type TDialogContentState = Nullable<{
  content: JSX.Element;
  className?: string;
}>;

type DialogProviderProps = {
  children: ReactNode;
};

export const DialogProvider: FC<DialogProviderProps> = ({ children }) => {
  const [dialogContent, setDialogContent] = useState<TDialogContentState>(null);

  const closeDialog = useCallback(() => {
    setDialogContent(null);
  }, []);

  const showDialog = useCallback(
    ({ className, getContent }: TShowDialogProps) => {
      setDialogContent({
        className,
        content: getContent(closeDialog),
      });
    },
    [closeDialog]
  );

  return (
    <DialogContext.Provider value={{ showDialog, closeDialog }}>
      {children}
      {dialogContent && <>{dialogContent.content}</>}
    </DialogContext.Provider>
  );
};
