import { Controller, useFormContext } from 'react-hook-form';

import { VirtualCombobox } from './combobox-virtual';

import type { Control, FieldValues, Path } from 'react-hook-form';
import type { VirtualComboboxProps } from './combobox-virtual';
import type { OptionBase } from '@/shared/interface';

type FormComboboxProps<T extends FieldValues> = Omit<VirtualComboboxProps, 'onClear'> & {
  name: Path<T>;
  control?: Control<T>;
  onChangeCallback?: (value: Nullable<OptionBase>) => void;
};

export const FormVirtualCombobox = <T extends FieldValues>({
  name,
  options,
  onChangeCallback,
  control: externalControl,
  ...restProps
}: FormComboboxProps<T>) => {
  const formContext = useFormContext<T>();
  const control = externalControl || formContext?.control;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleValueChange = (selectedOption: Nullable<OptionBase>) => {
          field.onChange(selectedOption);
          onChangeCallback?.(selectedOption);
        };

        return (
          <VirtualCombobox
            {...field}
            onValueChange={(value) => handleValueChange(value)}
            invalid={fieldState.invalid}
            errors={[fieldState.error]}
            options={options}
            {...restProps}
            disabled={restProps.disabled || field.disabled}
          />
        );
      }}
    />
  );
};
