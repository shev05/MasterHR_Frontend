import { Controller, useFormContext } from 'react-hook-form';

import { MultipleSelect } from './multiple-select';

import type { FC } from 'react';
import type { MultipleSelectProps } from './multiple-select';

export type FormMultipleSelectProps = MultipleSelectProps & {
  name: string;
  onChangeCallback?: (value: unknown) => void;
};

export const FormMultipleSelect: FC<FormMultipleSelectProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState, field }) => (
        <MultipleSelect
          {...field}
          onValueChange={(value) => {
            onChangeCallback?.(value);
            field.onChange(value);
          }}
          invalid={fieldState.invalid}
          error={[fieldState.error]}
          {...props}
        />
      )}
    />
  );
};
