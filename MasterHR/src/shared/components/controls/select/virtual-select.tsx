import { useVirtualizer } from '@tanstack/react-virtual';
import { XIcon } from 'lucide-react';
import { useCallback, useId, useMemo, useState } from 'react';

import {
  BaseSelect,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';

import type { BaseSelectProps, FieldErrorProps, fieldVariants, SelectValueProps } from '@/shared/components/ui';
import type { OptionBase } from '@/shared/interface';
import type { SelectRootChangeEventDetails } from '@base-ui/react/select';
import type { VariantProps } from 'class-variance-authority';
import type { FC } from 'react';

export type VirtualSelectProps = BaseSelectProps &
  SelectValueProps & {
    label?: string;
    description?: string;
    errors?: FieldErrorProps['errors'];
    invalid?: boolean;
    options?: Array<OptionBase>;
    fieldOrientation?: VariantProps<typeof fieldVariants>['orientation'];
    isClearable?: boolean;
  };

export const VirtualSelect: FC<VirtualSelectProps> = ({
  label,
  required = false,
  placeholder = 'Выберите',
  options,
  description,
  invalid = false,
  errors,
  fieldOrientation = 'vertical' as const,
  isClearable = false,
  value,
  onValueChange,
  ...restProps
}) => {
  const id = useId();
  const [parentScrollableNode, setParentScrollableNode] = useState<Nullable<HTMLDivElement>>(null);

  const virtualizer = useVirtualizer({
    count: options?.length || 0,
    getScrollElement: () => parentScrollableNode,
    estimateSize: () => 45,
    overscan: 10,
  });

  const stableOptions = useMemo(() => options || [], [options]);

  const findOptionByValue = useCallback(
    (value: Nullable<string | number | undefined>) => {
      return stableOptions.find((item) => item.value.toString() === value?.toString());
    },
    [stableOptions]
  );

  const handleValueReset = (e: React.MouseEvent) => {
    e.preventDefault();
    onValueChange?.(null, e as unknown as SelectRootChangeEventDetails);
  };

  const handleValueChange = useCallback(
    (newValue: unknown, eventDetails: SelectRootChangeEventDetails) => {
      const typedValue = newValue as Nullable<string | number>;
      const selectedOption = findOptionByValue(typedValue);

      if (!selectedOption && typedValue !== null) return;

      onValueChange?.(typedValue, eventDetails);
    },
    [findOptionByValue, onValueChange]
  );

  const refCallback = useCallback((node: HTMLDivElement) => {
    if (node) {
      setParentScrollableNode(node);
    }
  }, []);

  const virtualItems = virtualizer.getVirtualItems();

  const hasValue = value !== undefined && value !== null && value !== '';
  const selectedLabel = findOptionByValue(value as Nullable<string | number>)?.label;

  return (
    <Field data-invalid={invalid} orientation={fieldOrientation} className='min-w-42'>
      {label && (
        <FieldLabel htmlFor={id}>
          {label}
          {required && '*'}
        </FieldLabel>
      )}
      <BaseSelect
        id={id}
        items={stableOptions || []}
        {...restProps}
        disabled={restProps.disabled}
        value={value || ''}
        onValueChange={handleValueChange}
      >
        <div className='relative'>
          <SelectTrigger data-invalid={invalid ? 'true' : undefined} className='w-full'>
            <SelectValue
              placeholder={placeholder}
              render={
                <span className={cn('text-muted-foreground truncate pe-3', hasValue && 'text-foreground')}>
                  {selectedLabel || placeholder}
                </span>
              }
            />
          </SelectTrigger>
          {isClearable && hasValue && (
            <button
              type='button'
              onClick={handleValueReset}
              className='absolute right-8 top-1/2 ms-auto -translate-y-1/2'
            >
              <XIcon className='text-muted-foreground size-4 cursor-pointer' />
            </button>
          )}
        </div>

        <SelectPositioner className='max-w-(--anchor-width) w-full'>
          <SelectContent ref={refCallback} style={{ height: 200 }}>
            {options?.length === 0 && (
              <p key='empty' className='px-2 py-1.5 text-xs'>
                Нет доступных вариантов
              </p>
            )}
            <div className='relative w-full' style={{ height: virtualizer.getTotalSize() }}>
              <div
                className='absolute left-0 top-0 w-full'
                style={{ transform: `translateY(${virtualItems[0]?.start ?? 0}px)` }}
              >
                {virtualItems?.map((virtualItem) => {
                  const option = options?.[virtualItem.index];
                  return (
                    <SelectItem
                      key={virtualItem.key}
                      data-index={virtualItem.index}
                      ref={virtualizer.measureElement}
                      value={option?.value}
                    >
                      {option?.label}
                    </SelectItem>
                  );
                })}
              </div>
            </div>
          </SelectContent>
        </SelectPositioner>
      </BaseSelect>
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={errors} />}
    </Field>
  );
};
