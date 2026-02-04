import { Toast } from '@base-ui/react';
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon, XIcon } from 'lucide-react';

import {
  SuspenseWrapper,
  ToastClose,
  ToastContent,
  ToastDescription,
  toastManager,
  ToastRoot,
  ToastTitle,
  ToastType,
  ToastViewport,
} from './ui';

import type { JSX } from 'react';

const createToastMethod = (type: ToastType) => {
  return (title: string, opts?: { description?: string }) => {
    toastManager.add({
      title,
      description: opts?.description,
      data: { type },
    });
  };
};

export const toast = Object.assign(createToastMethod(ToastType.Default), {
  success: createToastMethod(ToastType.Success),
  default: createToastMethod(ToastType.Default),
  error: createToastMethod(ToastType.Error),
  info: createToastMethod(ToastType.Info),
  warning: createToastMethod(ToastType.Warning),
});

export function Toaster() {
  const { toasts } = Toast.useToastManager();

  const icons: Record<string, JSX.Element> = {
    [ToastType.Default]: <InfoIcon className='size-4' />,
    [ToastType.Success]: <CircleCheckIcon className='size-4' />,
    [ToastType.Error]: <OctagonXIcon className='size-4' />,
    [ToastType.Info]: <InfoIcon className='size-4' />,
    [ToastType.Warning]: <TriangleAlertIcon className='size-4' />,
  };

  return (
    <ToastViewport>
      {toasts.map((toast) => {
        return (
          <ToastRoot key={toast.id} toast={toast} data-type={toast.data?.type} swipeDirection='right'>
            <ToastContent className='flex items-center gap-2'>
              <div className='shrink-0'>{icons[toast.data?.type ?? ToastType.Default]}</div>
              <div className='flex flex-col gap-1'>
                <ToastTitle>{toast.title}</ToastTitle>
                <SuspenseWrapper condition={!!toast.description}>
                  <ToastDescription>{toast.description}</ToastDescription>
                </SuspenseWrapper>
              </div>
              <ToastClose>
                <XIcon className='size-4' />
              </ToastClose>
            </ToastContent>
          </ToastRoot>
        );
      })}
    </ToastViewport>
  );
}
