import { Controller, useFormContext } from 'react-hook-form';

import { DateRangePicker } from './date-range-picker';

import type { DateRangePickerProps } from './date-range-picker';
import type { DateRange } from 'react-day-picker';
import type { FC } from 'react';

export type FormDateRangePickerProps = DateRangePickerProps & {
  name: string;
  onChangeCallback?: (value: DateRange) => void;
};

export const FormDateRangePicker: FC<FormDateRangePickerProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState, field }) => (
        <DateRangePicker
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
