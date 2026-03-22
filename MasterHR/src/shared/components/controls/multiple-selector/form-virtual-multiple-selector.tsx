import { Controller, useFormContext } from 'react-hook-form';

import { VirtualMultipleSelector } from './virtual-multiple-selector';

import type { OptionBase } from '@/shared/interface';
import type { FC } from 'react';
import type { MultipleSelectorProps } from './multiple-selector';

type FormVirtualMultipleSelectorProps = MultipleSelectorProps & {
  name: string;
  onChangeCallback?: (value: Nullable<OptionBase>[]) => void;
};

export const FormVirtualMultipleSelector: FC<FormVirtualMultipleSelectorProps> = ({
  name,
  onChangeCallback,
  ...restProps
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handleValueChange = (selectedOption: Nullable<OptionBase>[]) => {
          field.onChange(selectedOption);
          onChangeCallback?.(selectedOption);
        };

        return (
          <VirtualMultipleSelector
            {...field}
            onValueChange={handleValueChange}
            invalid={fieldState.invalid}
            errors={[fieldState.error]}
            {...restProps}
            disabled={restProps.disabled || field.disabled}
          />
        );
      }}
    />
  );
};
