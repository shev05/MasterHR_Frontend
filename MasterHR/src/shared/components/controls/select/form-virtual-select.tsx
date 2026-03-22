import { Controller, useFormContext } from 'react-hook-form';

import { VirtualSelect } from './virtual-select';

import type { FC } from 'react';
import type { VirtualSelectProps } from './virtual-select';

type FormSelectProps = VirtualSelectProps & {
  name: string;
  onChangeCallback?: (value: unknown) => void;
};

export const FormVirtualSelect: FC<FormSelectProps> = ({ name, onChangeCallback, ...restProps }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <VirtualSelect
            {...field}
            onValueChange={(value) => {
              onChangeCallback?.(value);
              field.onChange(value);
            }}
            invalid={fieldState.invalid}
            errors={[fieldState.error]}
            {...restProps}
          />
        );
      }}
    />
  );
};
