import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { CheckIcon, XIcon } from 'lucide-react';

import { Separator } from '@/shared/components/ui/separator';
import { cn } from '@/shared/lib/cn';

import { BaseInput } from './base-input';

import type { OptionBase } from '@/shared/interface';
import type { RefObject } from 'react';

export type BaseComboboxProps = ComboboxPrimitive.Root.Props<Nullable<OptionBase>, false>;
export type BaseMultipleComboboxProps = ComboboxPrimitive.Root.Props<Nullable<OptionBase>, true>;

const BaseCombobox = ComboboxPrimitive.Root;

export type ComboboxInputProps = React.ComponentProps<typeof ComboboxPrimitive.Input>;

function ComboboxInput(
  props: ComboboxPrimitive.Input.Props & {
    ref?: RefObject<HTMLInputElement | null>;
  }
) {
  return <ComboboxPrimitive.Input data-slot='combobox-input' render={<BaseInput />} {...props} />;
}

function ComboboxTrigger(props: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot='combobox-trigger disabled:cursor-not-allowed disabled:opacity-50'
      {...props}
    />
  );
}

function ComboboxIcon(props: React.ComponentProps<typeof ComboboxPrimitive.Icon>) {
  return <ComboboxPrimitive.Icon data-slot='combobox-icon' {...props} />;
}

function ComboboxClear({ children, className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Clear>) {
  return (
    <ComboboxPrimitive.Clear
      className={cn(
        'text-muted-foreground flex h-9 w-6 cursor-pointer items-center justify-center rounded bg-transparent p-0',
        'disabled:opacity-50',
        className
      )}
      aria-label='Clear selection'
      data-slot='combobox-clear'
      {...props}
    >
      {children ?? <XIcon className='size-4' />}
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxValue(props: React.ComponentProps<typeof ComboboxPrimitive.Value>) {
  return <ComboboxPrimitive.Value data-slot='combobox-value' {...props} />;
}

function ComboboxChips({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Chips>) {
  return (
    <ComboboxPrimitive.Chips
      data-slot='combobox-chips'
      className={cn(
        'flex min-h-9 flex-wrap items-start gap-1 rounded border px-1.5 py-1.5 transition-[color,box-shadow]',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        className
      )}
      {...props}
    />
  );
}

function ComboboxChip({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Chip>) {
  return (
    <ComboboxPrimitive.Chip
      data-slot='combobox-chip'
      className={cn(
        'bg-secondary text-foreground flex cursor-default items-center gap-1 text-wrap break-all rounded-lg px-1 pe-0 ps-2 text-xs outline-none',
        className
      )}
      {...props}
    />
  );
}

function ComboboxChipRemove({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ChipRemove>) {
  return (
    <ComboboxPrimitive.ChipRemove
      data-slot='combobox-chip-remove'
      className={cn('hover:bg-accent-foreground/10 rounded-md p-1 text-inherit', className)}
      aria-label='Remove'
      {...props}
    >
      {children ?? <XIcon className='size-3.5' />}
    </ComboboxPrimitive.ChipRemove>
  );
}

function ComboboxPopup({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Popup>) {
  return (
    <ComboboxPrimitive.Popup
      data-slot='combobox-popup'
      className={cn(
        'w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) bg-popover outline-border max-h-80 scroll-pb-2 scroll-pt-2 overflow-y-auto overscroll-contain rounded-md py-2 shadow-md outline-1 data-[ending-style]:scale-95 data-[side=none]:data-[starting-style]:scale-100 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[side=none]:data-[starting-style]:opacity-100 data-[starting-style]:opacity-0 dark:shadow-none',
        className
      )}
      {...props}
    />
  );
}

function ComboboxPositioner({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Positioner>) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        data-slot='combobox-positioner'
        className={cn('z-50 outline-none', className)}
        {...props}
      />
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxArrow(props: React.ComponentProps<typeof ComboboxPrimitive.Arrow>) {
  return <ComboboxPrimitive.Arrow data-slot='combobox-arrow' {...props} />;
}

function ComboboxStatus({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Status>) {
  return (
    <ComboboxPrimitive.Status
      data-slot='combobox-status'
      className={cn('px-4.5 text-muted-foreground py-2 text-sm empty:m-0 empty:p-0', className)}
      {...props}
    />
  );
}

function ComboboxEmpty({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot='combobox-empty'
      className={cn('text-muted-foreground not-empty:py-1 flex items-center justify-center text-sm', className)}
      {...props}
    />
  );
}

function ComboboxList(props: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return <ComboboxPrimitive.List data-slot='combobox-list' {...props} />;
}

function ComboboxRow(props: React.ComponentProps<typeof ComboboxPrimitive.Row>) {
  return <ComboboxPrimitive.Row data-slot='combobox-row' {...props} />;
}

function ComboboxItem({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      data-slot='combobox-item'
      className={cn(
        'data-[highlighted]:text-accent-foreground data-[highlighted]:before:-z-1 data-[highlighted]:before:bg-accent grid cursor-default select-none grid-cols-[0.95rem_1fr] items-center gap-2 text-wrap break-all py-2 pl-4 pr-8 text-sm leading-4 outline-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:rounded-sm',
        className
      )}
      {...props}
    />
  );
}

function ComboboxItemIndicator({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ItemIndicator>) {
  return (
    <ComboboxPrimitive.ItemIndicator
      data-slot='combobox-item-indicator'
      className={cn('col-start-0', className)}
      {...props}
    >
      {children && <CheckIcon className='size-4' />}
    </ComboboxPrimitive.ItemIndicator>
  );
}

function ComboboxSeparator(props: React.ComponentProps<typeof ComboboxPrimitive.Separator>) {
  return <ComboboxPrimitive.Separator data-slot='combobox-separator' render={<Separator />} {...props} />;
}

function ComboboxGroup({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Group>) {
  return <ComboboxPrimitive.Group data-slot='combobox-group' className={cn('mb-3 last:mb-0', className)} {...props} />;
}

function ComboboxGroupLabel({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.GroupLabel>) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot='combobox-group-label'
      className={cn('z-1 bg-background text-muted-foreground sticky top-0 py-2 pl-4 text-sm', className)}
      {...props}
    />
  );
}

function ComboboxCollection(props: React.ComponentProps<typeof ComboboxPrimitive.Collection>) {
  return <ComboboxPrimitive.Collection data-slot='combobox-collection' {...props} />;
}

export {
  BaseCombobox,
  ComboboxArrow,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPositioner,
  ComboboxRow,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
};
