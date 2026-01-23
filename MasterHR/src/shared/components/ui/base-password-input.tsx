import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

import { BaseInput, Button } from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';

import type { BaseInputProps } from '@/shared/components/ui';
import type { FC } from 'react';

export type BasePasswordInputProps = BaseInputProps;

export const BasePasswordInput: FC<BasePasswordInputProps> = ({ className, ...restProps }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='relative'>
      <BaseInput
        type={showPassword ? 'text' : 'password'}
        className={cn('hide-password-toggle pr-10', className)}
        {...restProps}
      />
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='absolute right-0 top-0 h-full max-w-fit px-3 py-2 hover:bg-transparent'
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={restProps.disabled}
      >
        {showPassword ? (
          <EyeIcon className='h-4 w-4' aria-hidden='true' />
        ) : (
          <EyeOffIcon className='h-4 w-4' aria-hidden='true' />
        )}
        <span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
		.hide-password-toggle::-ms-reveal,
		.hide-password-toggle::-ms-clear {
			visibility: hidden;
			pointer-events: none;
			display: none;
		}
	`}</style>
    </div>
  );
};
