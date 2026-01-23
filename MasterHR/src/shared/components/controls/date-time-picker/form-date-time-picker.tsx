import { Controller, useFormContext } from 'react-hook-form';

import { DateTimePicker } from './date-time-picker';

import type { DateTimePickerProps } from './date-time-picker';
import type { FC } from 'react';

export type FormDateTimePickerProps = DateTimePickerProps & {
  name: string;
  onChangeCallback?: (value: Date) => void;
};

export const FormDateTimePicker: FC<FormDateTimePickerProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState, field }) => (
        <DateTimePicker
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
