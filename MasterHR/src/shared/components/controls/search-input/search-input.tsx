import { Search, XIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks';

import type { BaseInputProps, FieldErrorProps } from '@/shared/components/ui';
import type { ChangeEvent, FC } from 'react';

type SearchInputProps = BaseInputProps & {
  label?: string;
  description?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
  onDebouncedChange?: (arg: string) => void;
  type?: 'digit' | 'letter';
};

export const SearchInput: FC<SearchInputProps> = ({
  label,
  placeholder = 'Поиск...',

  onDebouncedChange,
  description,
  invalid = false,
  errors,
  ...props
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(props.value || '');
  const id = useId();

  const debounce = useDebounce(300);

  const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchQuery(value);
    debounce(() => {
      onDebouncedChange?.(value);
    });
  };

  useEffect(() => {
    if (!props.value) setLocalSearchQuery('');
  }, [props.value]);

  return (
    <Field className='min-w-42'>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <InputGroup>
        <InputGroupInput
          placeholder={placeholder}
          value={localSearchQuery}
          onChange={searchHandler}
          onClick={(e) => e.stopPropagation()}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        {localSearchQuery && (
          <InputGroupAddon align='inline-end'>
            <XIcon
              className='size-4 cursor-pointer'
              onClick={() => {
                setLocalSearchQuery('');
                onDebouncedChange?.('');
              }}
            />
          </InputGroupAddon>
        )}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={errors} />}
    </Field>
  );
};
