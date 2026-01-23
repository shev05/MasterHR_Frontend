import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox } from './checkbox';

import type { FC } from 'react';
import type { CheckboxProps } from './checkbox';

export type FormCheckboxProps = CheckboxProps & {
  name: string;
  onChangeCallback?: (value: boolean | string) => void;
};

export const FormCheckbox: FC<FormCheckboxProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState, field }) => (
        <Checkbox
          {...field}
          onCheckedChange={(checked) => {
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
