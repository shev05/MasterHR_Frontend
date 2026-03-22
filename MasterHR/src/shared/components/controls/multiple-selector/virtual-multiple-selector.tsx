import { Combobox } from '@base-ui/react/combobox';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CheckIcon } from 'lucide-react';
import { Fragment, useCallback, useDeferredValue, useId, useMemo, useRef, useState } from 'react';

import {
  BaseCombobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPositioner,
  ComboboxValue,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';

import type { BaseMultipleComboboxProps, FieldErrorProps } from '@/shared/components/ui';
import type { OptionBase } from '@/shared/interface';
import type { FC } from 'react';

function getItemLabel(item: OptionBase | null) {
  return item ? item.label : '';
}
export type VirtualMultipleSelectorProps = BaseMultipleComboboxProps & {
  label?: string;
  description?: string;
  placeholder?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
  options?: Array<OptionBase>;
};

export const VirtualMultipleSelector: FC<VirtualMultipleSelectorProps> = ({
  label,
  required = false,
  placeholder = 'Выберите',
  options = [],
  description,
  invalid = false,
  errors,

  ...restProps
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const deferredSearchValue = useDeferredValue(searchValue);

  const scrollElementRef = useRef<Nullable<HTMLDivElement>>(null);
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);

  const { contains } = Combobox.useFilter({ value: restProps.value });

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

  return (
    <Field data-invalid={invalid}>
      <BaseCombobox
        {...restProps}
        disabled={restProps.disabled}
        virtualized
        multiple
        items={options}
        filteredItems={filteredItems}
        open={open}
        onOpenChange={setOpen}
        inputValue={searchValue}
        onInputValueChange={setSearchValue}
        isItemEqualToValue={(item, selected) => {
          return item?.value === selected?.value || item?.id === selected?.id;
        }}
        itemToStringLabel={getItemLabel}
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
        <div className='flex w-full flex-col gap-0.5'>
          {label && (
            <FieldLabel htmlFor={id}>
              {label}
              {required && '*'}{' '}
            </FieldLabel>
          )}
          <ComboboxChips ref={containerRef} className={cn(invalid && 'border-destructive')}>
            <ComboboxValue>
              {(value: OptionBase[]) => (
                <Fragment>
                  {value.map((item) => (
                    <ComboboxChip key={item.id} aria-label={String(item.label)}>
                      {item.label}
                      <ComboboxChipRemove />
                    </ComboboxChip>
                  ))}
                  <ComboboxInput
                    id={id}
                    aria-invalid={invalid}
                    placeholder={placeholder}
                    className='h-6 flex-1 rounded border-0 bg-transparent pl-2 text-sm shadow-none outline-none focus-visible:ring-0'
                  />
                </Fragment>
              )}
            </ComboboxValue>
            <ComboboxClear className={'text-muted-foreground'} />
          </ComboboxChips>
        </div>

        <ComboboxPositioner className='z-50 outline-none' sideOffset={6} anchor={containerRef}>
          <ComboboxPopup>
            <ComboboxEmpty>Не найдено</ComboboxEmpty>
            <ComboboxList ref={handleScrollElementRef} className={'h-50 overflow-y-auto'}>
              <div className='relative w-full' style={{ height: `${virtualizer.getTotalSize()}px` }}>
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const item = filteredItems[virtualItem.index];
                  if (!item) return null;

                  const isSelected = restProps.value?.map((item) => item?.value).includes(item.value);

                  return (
                    <ComboboxItem
                      key={item.id}
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
                        height: virtualItem.size,
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
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxPositioner>
      </BaseCombobox>
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={errors} />}
    </Field>
  );
};
