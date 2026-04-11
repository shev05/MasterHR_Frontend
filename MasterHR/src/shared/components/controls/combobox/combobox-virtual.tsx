import { Combobox } from '@base-ui/react/combobox';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useCallback, useDeferredValue, useId, useMemo, useRef, useState } from 'react';

import {
  BaseCombobox,
  ComboboxClear,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPositioner,
  ComboboxTrigger,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';

import type { BaseComboboxProps, ComboboxInputProps, FieldErrorProps } from '@/shared/components/ui';
import type { FC } from 'react';
import type { OptionBase } from '@/shared/interface';

export type VirtualComboboxProps = BaseComboboxProps & {
  label?: string;
  description?: string;
  placeholder?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
  options?: Array<OptionBase>;

  comboboxInputValue?: string;
  onComboboxInputValueChange?: ComboboxInputProps['onChange'];
};

function getItemLabel(item: OptionBase | null) {
  return item ? item.label : '';
}

export const VirtualCombobox: FC<VirtualComboboxProps> = ({
  placeholder = 'Выберите значение',
  label,
  required = false,
  options = [],
  description,
  invalid = false,
  errors,

  value,
  onValueChange,

  ...restProps
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const deferredSearchValue = useDeferredValue(searchValue);

  const scrollElementRef = useRef<Nullable<HTMLDivElement>>(null);

  const { contains } = Combobox.useFilter({ value: value });

  const resolvedSearchValue = searchValue === '' || deferredSearchValue === '' ? searchValue : deferredSearchValue;

  const filteredItems = useMemo(() => {
    if (resolvedSearchValue === '') {
      return options;
    }
    return options.filter((item) => contains(item, resolvedSearchValue, getItemLabel));
  }, [contains, resolvedSearchValue, options]);

  const virtualizer = useVirtualizer({
    enabled: open,
    count: filteredItems.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 32,
    overscan: 20,
    paddingStart: 8,
    paddingEnd: 8,
    scrollPaddingEnd: 8,
    scrollPaddingStart: 8,
  });

  const handleScrollElementRef = useCallback(
    (element: HTMLDivElement | null) => {
      scrollElementRef.current = element;
      if (element) {
        virtualizer.measure();
      }
    },
    [virtualizer]
  );

  const totalSize = virtualizer.getTotalSize();

  return (
    <Field data-invalid={invalid} className='min-w-42'>
      <BaseCombobox
        {...restProps}
        disabled={restProps.disabled}
        virtualized
        items={options}
        filteredItems={filteredItems}
        open={open}
        onOpenChange={setOpen}
        inputValue={value?.label || searchValue || ''}
        onInputValueChange={setSearchValue}
        value={value || null}
        onValueChange={onValueChange}
        itemToStringLabel={getItemLabel}
        itemToStringValue={(item) => item?.value.toString() || ''}
        onItemHighlighted={(item, { reason, index }) => {
          if (!item) {
            return;
          }

          const isStart = index === 0;
          const isEnd = index === filteredItems.length - 1;
          const shouldScroll = reason === 'none' || (reason === 'keyboard' && (isStart || isEnd));

          if (shouldScroll) {
            queueMicrotask(() => {
              virtualizer.scrollToIndex(index, { align: isEnd ? 'start' : 'end' });
            });
          }
        }}
      >
        <div className='relative flex flex-col'>
          {label && (
            <FieldLabel htmlFor={id}>
              {label}
              {required && '*'}
            </FieldLabel>
          )}

          <ComboboxInput aria-invalid={invalid} placeholder={placeholder} id={id} className={'pe-15 truncate'} />
          <div className='text-muted-foreground absolute bottom-0 right-1 flex h-9 items-center justify-center'>
            <ComboboxClear />

            <ComboboxTrigger
              aria-invalid={invalid}
              className={cn(
                'text-muted-foreground h-9 w-6 border-none bg-transparent shadow-none hover:bg-transparent',
                restProps?.disabled && 'opacity-50'
              )}
              aria-label='Open popup'
            >
              <ChevronDownIcon className='size-4' />
            </ComboboxTrigger>
          </div>
        </div>

        <ComboboxPositioner sideOffset={4} className='outline-none'>
          <ComboboxPopup className='max-h-[min(22rem,var(--available-height))] w-[var(--anchor-width)] max-w-[var(--available-width)]'>
            <ComboboxEmpty>Не найдено</ComboboxEmpty>
            <ComboboxList className='p-0'>
              {filteredItems.length > 0 && (
                <div
                  role='presentation'
                  ref={handleScrollElementRef}
                  className='h-[min(21rem,var(--total-size))] max-h-[var(--available-height)] scroll-p-2 overflow-auto overscroll-contain'
                  style={{ '--total-size': `${totalSize}px` } as React.CSSProperties}
                >
                  <div role='presentation' className='relative w-full' style={{ height: totalSize }}>
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                      const item = filteredItems[virtualItem.index];
                      if (!item) return null;

                      const isSelected = value?.value === item.value;

                      return (
                        <ComboboxItem
                          key={virtualItem.key}
                          index={virtualItem.index}
                          data-index={virtualItem.index}
                          ref={virtualizer.measureElement}
                          value={item}
                          aria-setsize={filteredItems.length}
                          aria-posinset={virtualItem.index + 1}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            // minHeight: virtualItem.size,
                            transform: `translateY(${virtualItem.start}px)`,
                          }}
                        >
                          <ComboboxItemIndicator keepMounted={isSelected}>
                            <CheckIcon className={'size-4'} />
                          </ComboboxItemIndicator>

                          <div className='col-start-2'>{item.label}</div>
                        </ComboboxItem>
                      );
                    })}
                  </div>
                </div>
              )}
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxPositioner>
      </BaseCombobox>
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={errors} />}
    </Field>
  );
};
