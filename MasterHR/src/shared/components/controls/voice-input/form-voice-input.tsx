import { Controller, useFormContext } from 'react-hook-form';

import { VoiceInput } from './voice-input';

import type { VoiceInputProps } from './voice-input';
import type { FC } from 'react';

type FormVoiceInputProps = VoiceInputProps & {
  name: string;
  onChangeCallback?: (value: string) => void;
};

export const FormVoiceInput: FC<FormVoiceInputProps> = ({ name, onChangeCallback, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      render={({ fieldState, field }) => (
        <VoiceInput
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
