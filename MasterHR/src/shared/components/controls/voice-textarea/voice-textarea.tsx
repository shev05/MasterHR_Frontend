import { useId } from 'react';
import { Mic, Mic2, MicOff } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { BaseTextarea, Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';
import { useVoiceInputStore } from '@/store/voice-input-store';

import type { BaseTextareaProps, FieldErrorProps } from '@/shared/components/ui';
import type { FC } from 'react';

export type VoiceTextareaProps = BaseTextareaProps & {
  label?: string;
  description?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
  onValueChange?: (value: string) => void;
  voiceEnabled?: boolean;
  rows?: number;
};

export const VoiceTextarea: FC<VoiceTextareaProps> = ({
  label,
  required = false,
  errors,
  invalid = false,
  description,
  placeholder = 'Введите что-нибудь',
  value,
  onValueChange,
  voiceEnabled = true,
  rows = 4,
  ...props
}) => {
  const textareaId = useId();
  const voiceInputId = useId();

  const { activeInputId, setActiveInput } = useVoiceInputStore();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const isActive = activeInputId === voiceInputId;
  const isListening = listening && isActive;

  const handleVoiceInput = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      if (transcript && isActive) {
        const newValue = value ? `${value} ${transcript}` : transcript;
        onValueChange?.(newValue);
      }
      resetTranscript();
      setActiveInput(null);
    } else {
      if (activeInputId && activeInputId !== voiceInputId) {
        SpeechRecognition.stopListening();
        resetTranscript();
      }

      resetTranscript();
      SpeechRecognition.startListening({
        language: 'ru-RU',
        continuous: true,
      });
      setActiveInput(voiceInputId);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange?.(e.target.value);
  };

  const isDisabled = activeInputId !== null && activeInputId !== voiceInputId;

  if (!browserSupportsSpeechRecognition) {
    console.warn('Браузер не поддерживает распознавание речи');
  }

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={textareaId} className='px-2'>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}

      <div className='relative'>
        <BaseTextarea
          id={textareaId}
          aria-invalid={invalid}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={cn(voiceEnabled && 'pr-10')}
          {...props}
        />

        {voiceEnabled && browserSupportsSpeechRecognition && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className={cn(
              'absolute right-1 top-3 h-7 w-7 p-0',
              isListening && 'text-destructive animate-pulse',
              isDisabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={handleVoiceInput}
            disabled={isDisabled}
            title={isDisabled ? 'Другой голосовой ввод активен' : isListening ? 'Остановить запись' : 'Голосовой ввод'}
          >
            {isListening ? <MicOff className='h-4 w-4' /> : <Mic className='h-4 w-4' />}
          </Button>
        )}
      </div>

      {isListening && transcript && (
        <div className='text-muted-foreground mt-1 flex animate-pulse flex-row gap-1 px-2 text-sm'>
          <Mic2 className='h-4 w-4' /> {transcript}
        </div>
      )}

      {invalid && <FieldError errors={errors} className='px-2' />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
