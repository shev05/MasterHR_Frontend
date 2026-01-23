import { useId } from 'react';

import {
  BaseRadioGroup,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  RadioGroupItem,
} from '@/shared/components/ui';

import type { BaseRadioGroupProps, FieldErrorProps } from '@/shared/components/ui';
import type { FC } from 'react';
import type { OptionBase } from '@/shared/interface';

export type RadioGroupProps = BaseRadioGroupProps & {
  label?: string;
  description?: string;
  error: FieldErrorProps['errors'];
  invalid: boolean;
  options: OptionBase[];
};

export const RadioGroup: FC<RadioGroupProps> = ({
  label,
  required = false,
  error,
  description,
  invalid = false,
  options,
  ...props
}) => {
  const radioGroupId = useId();

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={radioGroupId} className='px-2'>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}
      <BaseRadioGroup id={radioGroupId} {...props}>
        {options.map((option) => (
          <div key={option.value} className='flex items-center space-x-2 px-4'>
            <RadioGroupItem value={option.value} id={`${radioGroupId}-${option.value}`} />
            <FieldLabel htmlFor={`${radioGroupId}-${option.value}`} className='cursor-pointer text-sm font-normal'>
              {option.label}
            </FieldLabel>
          </div>
        ))}
      </BaseRadioGroup>
      {invalid && <FieldError errors={error} className='px-2' />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
