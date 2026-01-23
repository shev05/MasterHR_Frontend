import { useId } from 'react';

import { BaseSwitch, Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui';

import type { BaseSwitchProps, FieldErrorProps } from '@/shared/components/ui';
import type { FC } from 'react';

export type SwitchProps = BaseSwitchProps & {
  label?: string;
  description?: string;
  error?: FieldErrorProps['errors'];
  invalid?: boolean;
};

export const Switch: FC<SwitchProps> = ({ label, required, error, invalid = false, description, ...props }) => {
  const switchId = useId();

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={switchId} className='px-2'>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}
      <div className='px-2'>
        <BaseSwitch id={switchId} {...props} />
      </div>
      {invalid && <FieldError errors={error} className='px-2' />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
