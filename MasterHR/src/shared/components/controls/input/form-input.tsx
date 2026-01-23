import { Controller, useFormContext } from 'react-hook-form';

import { Input } from './input';

import type { InputProps } from './input';
import type { FC } from 'react';

type FormInputProps = InputProps & {
  name: string;
  onChangeCallback?: (value: string) => void;
};

export const FormInput: FC<FormInputProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState, field }) => (
        <Input
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
