import { Controller, useFormContext } from 'react-hook-form';

import { VoiceTextarea } from './voice-textarea';

import type { VoiceTextareaProps } from './voice-textarea';
import type { FC } from 'react';

type FormVoiceTextareaProps = VoiceTextareaProps & {
  name: string;
  onChangeCallback?: (value: string) => void;
};

export const FormVoiceTextarea: FC<FormVoiceTextareaProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      render={({ fieldState, field }) => (
        <VoiceTextarea
          {...field}
          errors={[fieldState.error]}
          onValueChange={(value) => {
            onChangeCallback?.(value);
            field.onChange(value);
          }}
          invalid={fieldState.invalid}
          {...props}
        />
      )}
    />
  );
};
