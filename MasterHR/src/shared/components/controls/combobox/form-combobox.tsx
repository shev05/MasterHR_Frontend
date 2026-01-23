import { Controller, useFormContext } from 'react-hook-form';

import { Combobox } from './combobox';

import type { ComboboxProps } from './combobox';
import type { FC } from 'react';

export type FormComboboxProps = ComboboxProps & {
  name: string;
  onChangeCallback?: (value: unknown) => void;
};

export const FormCombobox: FC<FormComboboxProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState, field }) => (
        <Combobox
          {...field}
          errors={[fieldState.error]}
          onValueChange={(value) => {
            onChangeCallback?.(value);
            field.onChange(value);
          }}
          invalid={fieldState.invalid}
          {...props}
        />
      )}
    />
  );
};
