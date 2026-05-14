import { Controller, useFormContext } from 'react-hook-form';

import { Textarea } from './textarea';

import type { FC } from 'react';
import type { TextareaProps } from './textarea';

type FormTextareaProps = TextareaProps & {
  name: string;
  onChangeCallback?: (value: string) => void;
};

export const FormTextarea: FC<FormTextareaProps> = ({ name, onChangeCallback, ...restProps }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Textarea
          {...field}
          onChange={(e) => {
            onChangeCallback?.(e.target.value);
            field.onChange(e.target.value);
          }}
          invalid={fieldState.invalid}
          errors={[fieldState.error]}
          {...restProps}
          disabled={restProps.disabled || field.disabled}
        />
      )}
    />
  );
};
