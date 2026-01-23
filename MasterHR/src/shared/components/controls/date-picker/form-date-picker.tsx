import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from './date-picker';

import type { DatePickerProps } from './date-picker';
import type { FC } from 'react';

export type FormDatePickerProps = DatePickerProps & {
  name: string;
  onChangeCallback?: (value: Date) => void;
};

export const FormDatePicker: FC<FormDatePickerProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState, field }) => (
        <DatePicker
          {...field}
          onValueChange={(checked) => {
            field.onChange(checked);
            onChangeCallback?.(checked);
          }}
          error={[fieldState.error]}
          invalid={fieldState.invalid}
          {...props}
        />
      )}
    />
  );
};
