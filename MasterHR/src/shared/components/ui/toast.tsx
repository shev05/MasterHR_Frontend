import { Toast, Toast as ToastPrimitive } from '@base-ui/react/toast';
import * as React from 'react';

import { cn } from '@/shared/lib/cn';

export enum ToastType {
  Default = 'default',
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export const typeClasses: Record<ToastType, { bg: string; border: string; text: string }> = {
  [ToastType.Default]: {
    bg: 'var(--toast-default-background)',
    border: 'var(--toast-default-border)',
    text: 'var(--toast-default-foreground)',
  },
  [ToastType.Success]: {
    bg: 'var(--toast-success-background)',
    border: 'var(--toast-success-border)',
    text: 'var(--toast-success-foreground)',
  },
  [ToastType.Error]: {
    bg: 'var(--toast-error-background)',
    border: 'var(--toast-error-border)',
    text: 'var(--toast-error-foreground)',
  },
  [ToastType.Info]: {
    bg: 'var(--toast-info-background)',
    border: 'var(--toast-info-border)',
    text: 'var(--toast-info-foreground)',
  },
  [ToastType.Warning]: {
    bg: 'var(--toast-warning-background)',
    border: 'var(--toast-warning-border)',
    text: 'var(--toast-warning-foreground)',
  },
};

export const toastManager = Toast.createToastManager();

function ToastProvider(props: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider data-slot='toast-provider' timeout={3000} toastManager={toastManager} {...props} />;
}

function ToastRoot({ className, toast, ...props }: React.ComponentProps<typeof ToastPrimitive.Root>) {
  const type = (toast.data?.type as ToastType) ?? ToastType.Default;
  const colors = typeClasses[type];

  return (
    <ToastPrimitive.Root
      data-slot='toast-root'
      className={cn(
        "absolute left-0 right-0 top-0 z-[calc(1000-var(--toast-index))] mx-auto h-[var(--height)] w-[360px] origin-top select-none rounded-lg border bg-clip-padding p-4 shadow-lg [--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)+(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s] after:absolute after:bottom-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-[expanded]:h-[var(--toast-height)] data-[ending-style]:opacity-0 data-[limited]:opacity-0 data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-[starting-style]:[transform:translateY(-150%)] data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(-150%)]",
        'border-[var(--toast-border)] bg-[var(--toast-bg)] text-[var(--toast-text)]',
        className
      )}
      style={
        {
          '--toast-bg': colors.bg,
          '--toast-border': colors.border,
          '--toast-text': colors.text,
        } as React.CSSProperties
      }
      toast={toast}
      {...props}
    />
  );
}

function ToastViewport({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport
        data-slot='toast-viewport'
        className={cn('z-100 fixed bottom-auto left-auto right-[1rem] top-[1rem] mx-auto flex w-[360px]', className)}
        {...props}
      />
    </ToastPrimitive.Portal>
  );
}

function ToastPositioner({
  sideOffset = 4,
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Positioner>) {
  return (
    <ToastPrimitive.Positioner
      data-slot='toast-positioner'
      sideOffset={sideOffset}
      className={cn('z-50', className)}
      {...props}
    />
  );
}

function ToastContent({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Content>) {
  return (
    <ToastPrimitive.Content
      data-slot='toast-content'
      className={cn(
        'overflow-hidden transition-opacity [transition-duration:250ms] data-[behind]:pointer-events-none data-[expanded]:pointer-events-auto data-[behind]:opacity-0 data-[expanded]:opacity-100',
        className
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot='toast-title'
      className={cn('text-[0.813rem] font-medium leading-5', className)}
      {...props}
    />
  );
}

function ToastDescription({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot='toast-description'
      className={cn('text-[0.813rem] leading-5', className)}
      {...props}
    />
  );
}

function ToastAction({ ...props }: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return <ToastPrimitive.Action data-slot='toast-action' {...props} />;
}

function ToastClose({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot='toast-close'
      className={cn(
        'rounded=ful 0 border-1 absolute -left-2 -top-2 flex size-5 cursor-pointer items-center justify-center rounded-full p-1',
        'border-[var(--toast-border)] bg-[var(--toast-bg)] text-[var(--toast-text)] hover:opacity-80',
        className
      )}
      {...props}
    />
  );
}

function ToastArrow({ ...props }: React.ComponentProps<typeof ToastPrimitive.Arrow>) {
  return <ToastPrimitive.Arrow data-slot='toast-arrow' {...props} />;
}

export {
  ToastAction,
  ToastArrow,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPositioner,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
};
