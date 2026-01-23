import { Controller, useFormContext } from 'react-hook-form';

import { RadioGroup } from './radio-group';

import type { RadioGroupProps } from './radio-group';
import type { FC } from 'react';

export type FormRadioGroupProps = RadioGroupProps & {
  name: string;
  onChangeCallback?: (value: unknown) => void;
};

export const FormRadioGroup: FC<FormRadioGroupProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState, field }) => (
        <RadioGroup
          {...field}
          onValueChange={(value) => {
            onChangeCallback?.(value);
            field.onChange(value);
          }}
          {...props}
          invalid={fieldState.invalid}
          error={[fieldState.error]}
        />
      )}
    />
  );
};
