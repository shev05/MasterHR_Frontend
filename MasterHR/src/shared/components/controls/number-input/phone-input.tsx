import { useId } from 'react';
import { PhoneInput as Phone } from 'react-international-phone';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui';
import { cn } from '@/shared/lib';

import type { BaseInputProps, FieldErrorProps } from '@/shared/components/ui';
import type { FC } from 'react';

export type PhoneInputProps = BaseInputProps & {
  label?: string;
  description?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
  onValueChange?: (value: string) => void;
};

export const PhoneInput: FC<PhoneInputProps> = ({
  label,
  required = false,
  errors,
  invalid = false,
  description,
  placeholder = 'Введите что-нибудь',
  value,
  onValueChange,
}) => {
  const inputId = useId();

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={inputId} className='px-2'>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}
      <Phone
        defaultCountry='by'
        value={value?.toString() || ''}
        onChange={(phone) => onValueChange?.(phone)}
        placeholder={placeholder}
        autoFocus={false}
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          'focus:outline-none focus:ring-0 focus:ring-offset-0',
          'focus-visible:outline-none focus-visible:ring-0'
        )}
        inputProps={{
          className: cn('focus-visible:outline-none focus-visible:ring-0'),
        }}
      />
      {invalid && <FieldError errors={errors} className='px-2' />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
