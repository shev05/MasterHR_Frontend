import { Controller, useFormContext } from 'react-hook-form';

import { ComboboxVirtual } from './combobox-virtual';

import type { ComboboxVirtualProps } from './combobox-virtual';
import type { FC } from 'react';

export type FormComboboxVirtualProps = ComboboxVirtualProps & {
  name: string;
  onChangeCallback?: (value: unknown) => void;
};

export const FormComboboxVirtual: FC<FormComboboxVirtualProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState, field }) => (
        <ComboboxVirtual
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
