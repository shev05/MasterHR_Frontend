import { Controller, useFormContext } from 'react-hook-form';

import { PasswordInput } from './password-input';

import type { FC } from 'react';
import type { PasswordInputProps } from './password-input';

export type FormPasswordInputProps = PasswordInputProps & {
  name: string;
  onChangeCallback?: (value: string) => void;
};

export const FormPasswordInput: FC<FormPasswordInputProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <PasswordInput
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
