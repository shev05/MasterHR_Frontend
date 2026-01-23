import { Controller, useFormContext } from 'react-hook-form';

import { Switch } from './switch';

import type { SwitchProps } from './switch';
import type { FC } from 'react';

export type FormSwitchProps = SwitchProps & {
  name: string;
  onChangeCallback?: (value: boolean) => void;
};

export const FormSwitch: FC<FormSwitchProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState, field }) => (
        <Switch
          {...field}
          onCheckedChange={(checked) => {
            field.onChange(checked);
            onChangeCallback?.(checked);
          }}
          invalid={fieldState.invalid}
          error={[fieldState.error]}
          {...props}
        />
      )}
    />
  );
};
