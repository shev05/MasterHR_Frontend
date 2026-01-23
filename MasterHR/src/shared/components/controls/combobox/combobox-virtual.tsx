import { useId, useMemo, useState, type ReactElement, useEffect } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { List } from 'react-window';

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
import type { RowComponentProps } from 'react-window';
import type { OptionBase } from '@/shared/interface';
import type { FC } from 'react';

export type ComboboxVirtualProps = BaseComboboxProps & {
  label?: string;
  description?: string;
  placeholder?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
  options?: OptionBase[];

  itemHeight?: number;
  listHeight?: number;
  onClear?: () => void;
  comboboxInputValue?: string;
  onComboboxInputValueChange?: ComboboxInputProps['onChange'];
};

const VirtualItem = ({ index, style, data }: RowComponentProps<{ data: OptionBase[] }>): ReactElement => {
  const item = data[index];

  return (
    <ComboboxItem value={item.value} style={style} className='flex'>
      <ComboboxItemIndicator />
      <span>{item.label}</span>
    </ComboboxItem>
  );
};

export const ComboboxVirtual: FC<ComboboxVirtualProps> = ({
  label,
  required = false,
  description,
  placeholder = 'Выберите значение',
  errors,
  invalid = false,
  options = [],
  itemHeight = 36,
  listHeight = 300,
  onClear,
  comboboxInputValue,
  onComboboxInputValueChange,
  value,
  ...props
}: ComboboxVirtualProps) => {
  const comboboxId = useId();
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (value !== undefined) {
      const selectedOption = options.find((option) => option.value === value);
      if (selectedOption) {
        setInputValue(selectedOption.label);
      }
    }
  }, [value, options]);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;

    return options.filter((option) => option.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()));
  }, [options, inputValue]);

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
        value={value}
        {...props}
        onValueChange={(value, e) => {
          const selectedOption = options.find((option) => option.value === value);
          setInputValue(selectedOption?.label || '');
          props.onValueChange?.(value, e);
        }}
      >
        <div className='relative flex flex-col gap-2'>
          <ComboboxInput
            placeholder={placeholder}
            value={inputValue}
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
            {filteredOptions.length === 0 ? (
              <ComboboxEmpty>Не найдено</ComboboxEmpty>
            ) : (
              <ComboboxList>
                {filteredOptions.length === 0 ? (
                  <ComboboxEmpty>Не найдено</ComboboxEmpty>
                ) : (
                  <div style={{ height: listHeight }}>
                    <List
                      rowCount={filteredOptions.length}
                      rowHeight={itemHeight}
                      rowComponent={VirtualItem}
                      rowProps={{ data: filteredOptions }}
                    />
                  </div>
                )}
              </ComboboxList>
            )}
          </ComboboxPopup>
        </ComboboxPositioner>
      </BaseCombobox>
      {invalid && <FieldError errors={errors} className='px-2' />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
