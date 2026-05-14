import { useId } from 'react';

import { BaseTextarea, Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui';

import type { BaseTextareaProps, FieldErrorProps } from '@/shared/components/ui';
import type { FC } from 'react';

export type TextareaProps = BaseTextareaProps & {
  label?: string;
  description?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
};

export const Textarea: FC<TextareaProps> = ({
  label,
  required = false,
  placeholder = 'Введите значение ',
  description,
  invalid = false,
  errors,
  ...restProps
}) => {
  const id = useId();

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={id}>
          {label}
          {required && '*'}
        </FieldLabel>
      )}
      <BaseTextarea id={id} placeholder={placeholder} aria-invalid={invalid} {...restProps} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={errors} />}
    </Field>
  );
};
