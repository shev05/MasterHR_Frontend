import { useId, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

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

import type { BaseComboboxProps, ComboboxInputProps, FieldErrorProps } from '@/shared/components/ui';
import type { OptionBase } from '@/shared/interface';
import type { FC } from 'react';

export type ComboboxProps = BaseComboboxProps & {
  label?: string;
  description?: string;
  placeholder?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
  options?: OptionBase[];

  onClear?: () => void;
  comboboxInputValue?: string;
  onComboboxInputValueChange?: ComboboxInputProps['onChange'];
  onLastOptionIntersect?: () => void;
};

export const Combobox: FC<ComboboxProps> = ({
  label,
  required = false,
  description,
  placeholder = 'Выберите значение',
  errors,
  invalid = false,
  options = [],
  onClear,
  comboboxInputValue,
  onComboboxInputValueChange,
  ...props
}: ComboboxProps) => {
  const comboboxId = useId();
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={comboboxId} className='px-2'>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}
      <BaseCombobox
        items={options}
        id={comboboxId}
        {...props}
        onValueChange={(value, e) => {
          setInputValue(options.find((option) => option.value === value)?.label || '');
          props.onValueChange?.(value, e);
        }}
      >
        <div className='relative flex flex-col gap-2'>
          <ComboboxInput
            placeholder={placeholder}
            value={inputValue || comboboxInputValue || ''}
            id={comboboxId}
            onChange={(e) => {
              setInputValue(e.target.value);
              onComboboxInputValueChange?.(e);
            }}
          />
          <div className='text-muted-foreground absolute bottom-0 right-0.5 flex h-9 items-center justify-center'>
            {inputValue && (
              <ComboboxClear
                onClick={() => {
                  setInputValue('');
                  onClear?.();
                }}
              />
            )}
            <ComboboxTrigger
              className='text-muted-foreground h-9 w-8 border-none bg-transparent shadow-none hover:bg-transparent'
              aria-label='Open popup'
            >
              <ChevronDownIcon className='size-4' />
            </ComboboxTrigger>
          </div>
        </div>
        <ComboboxPositioner sideOffset={6}>
          <ComboboxPopup>
            <ComboboxEmpty>Не найдено</ComboboxEmpty>
            <ComboboxList>
              {(item: OptionBase) => (
                <ComboboxItem key={item.id || item.value} value={item.value}>
                  <ComboboxItemIndicator />
                  <div className='col-start-2'>{item.label}</div>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxPositioner>
      </BaseCombobox>
      {invalid && <FieldError errors={errors} className='px-2' />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
