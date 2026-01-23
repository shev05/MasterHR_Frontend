import { Controller, useFormContext } from 'react-hook-form';

import { DateTimeRangePicker } from './date-time-range-picker';

import type { DateTimeRangePickerProps } from './date-time-range-picker';
import type { DateRange } from 'react-day-picker';
import type { FC } from 'react';

export type FormDateTimeRangePickerProps = DateTimeRangePickerProps & {
  name: string;
  onChangeCallback?: (value: DateRange) => void;
};

export const FormDateTimeRangePicker: FC<FormDateTimeRangePickerProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState, field }) => (
        <DateTimeRangePicker
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
