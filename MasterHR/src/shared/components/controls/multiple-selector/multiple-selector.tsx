import { CheckIcon } from 'lucide-react';
import { Fragment, useId, useRef } from 'react';

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

export type MultipleSelectorProps = BaseMultipleComboboxProps & {
  label?: string;
  description?: string;
  placeholder?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
  options?: Array<OptionBase>;
  onLastOptionIntersect?: () => void;
};

export const MultipleSelector: FC<MultipleSelectorProps> = ({
  label,
  required = false,
  placeholder = 'Выберите',
  options,
  description,
  invalid = false,
  errors,

  onLastOptionIntersect,
  ...restProps
}) => {
  const id = useId();
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);

  const isDisabled = restProps.disabled;

  return (
    <Field data-invalid={invalid}>
      <BaseCombobox
        {...restProps}
        disabled={isDisabled}
        items={options}
        multiple
        isItemEqualToValue={(item, selected) => {
          return item?.value === selected?.value || item?.id === selected?.id;
        }}
      >
        <div className='flex w-full flex-col gap-0.5'>
          {label && (
            <FieldLabel htmlFor={id}>
              {label}
              {required && '*'}
            </FieldLabel>
          )}
          <ComboboxChips
            ref={containerRef}
            className={cn(invalid && 'border-destructive')}
            onFocus={(e) => isDisabled && e.target.blur()}
          >
            <ComboboxValue>
              {(value: OptionBase[]) => {
                return (
                  <Fragment>
                    {value.map((language) => (
                      <ComboboxChip key={language.id} aria-label={String(language.label)}>
                        {language.label}
                        <ComboboxChipRemove />
                      </ComboboxChip>
                    ))}
                    <ComboboxInput
                      id={id}
                      aria-invalid={invalid}
                      placeholder={value.length > 0 ? '' : placeholder}
                      className='h-6 flex-1 rounded border-0 bg-transparent pl-2 text-sm shadow-none outline-none focus-visible:ring-0'
                    />
                  </Fragment>
                );
              }}
            </ComboboxValue>
            <ComboboxClear />
          </ComboboxChips>
        </div>

        <ComboboxPositioner className='z-50 outline-none' sideOffset={6} anchor={containerRef}>
          <ComboboxPopup className={cn(onLastOptionIntersect && 'max-h-50')}>
            <ComboboxEmpty>Не найдено</ComboboxEmpty>
            <ComboboxList>
              {(option: OptionBase) => (
                <ComboboxItem key={option.id} value={option}>
                  <ComboboxItemIndicator>
                    <CheckIcon className={'size-4'} />
                  </ComboboxItemIndicator>
                  <div className='col-start-2'>{option.label}</div>
                </ComboboxItem>
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
