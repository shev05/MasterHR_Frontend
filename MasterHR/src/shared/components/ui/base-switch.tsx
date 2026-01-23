import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/shared/lib/cn';

export type BaseSwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root>;

function BaseSwitch({ className, children, ...props }: BaseSwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'data-[checked]:bg-primary data-[unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[unchecked]:bg-input/80 shadow-xs peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children ?? <SwitchThumb />}
    </SwitchPrimitive.Root>
  );
}

function SwitchThumb({ className, ...props }: SwitchPrimitive.Thumb.Props) {
  return (
    <SwitchPrimitive.Thumb
      data-slot='switch-thumb'
      className={cn(
        'bg-background dark:data-[unchecked]:bg-foreground dark:data-[checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[checked]:translate-x-[calc(100%-2px)] data-[unchecked]:translate-x-0',
        className
      )}
      {...props}
    />
  );
}

export { BaseSwitch, SwitchThumb };
