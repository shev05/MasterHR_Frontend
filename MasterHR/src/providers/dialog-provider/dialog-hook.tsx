import { useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { DialogContext } from './dialog-context';

import type { DialogContextValue } from './dialog-context';
import type { JSX } from 'react';

export const useDialog = (): DialogContextValue => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Использование не в провайдере');
  }

  return context;
};

export type TShowLocalDialogProps = {
  getContent: (onClose: () => void) => JSX.Element;
};

export type UseLocalDialogReturnType = {
  dialog: Nullable<JSX.Element>;
  showDialog: ({ getContent }: TShowLocalDialogProps) => void;
  closeDialog: () => void;
};

export type LocalDialogContentState = Nullable<{
  content: JSX.Element;
}>;

export const UseLocalDialog = (): UseLocalDialogReturnType => {
  const [dialogContent, setDialogContent] = useState<LocalDialogContentState>(null);

  const onClose = useCallback(() => {
    setDialogContent(null);
  }, []);

  const dialog = useMemo(() => {
    if (dialogContent === null) return null;
    const { content } = dialogContent;

    return createPortal(content, document.body);
  }, [dialogContent]);

  const showDialog = useCallback(
    ({ getContent }: TShowLocalDialogProps) => {
      setDialogContent({
        content: getContent(onClose),
      });
    },
    [onClose]
  );

  return { dialog, showDialog, closeDialog: onClose };
};
