import { Controller, useFormContext } from 'react-hook-form';

import { Select } from './select';

import type { FC } from 'react';
import type { SelectProps } from './select';

export type FormSelectProps = SelectProps & {
  name: string;
  onChangeCallback?: (value: unknown) => void;
};

export const FormSelect: FC<FormSelectProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <Select
            {...field}
            onValueChange={(value) => {
              onChangeCallback?.(value);
              field.onChange(value);
            }}
            invalid={fieldState.invalid}
            error={[fieldState.error]}
            {...props}
            disabled={props.disabled || field.disabled}
          />
        );
      }}
    />
  );
};
