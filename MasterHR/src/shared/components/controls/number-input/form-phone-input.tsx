import { Controller, useFormContext } from 'react-hook-form';

import { PhoneInput } from './phone-input';

import type { FC } from 'react';
import type { PhoneInputProps } from './phone-input';

export type FormPhoneInputProps = PhoneInputProps & {
  name: string;
  onChangeCallback?: (value: string) => void;
};

export const FormPhoneInput: FC<FormPhoneInputProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <PhoneInput
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
