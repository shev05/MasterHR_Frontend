import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, FormInput, FormPasswordInput } from '@/shared/components';

import { LOGIN_DEFAULT_VALUES, LOGIN_FIELDS, LOGIN_FORM_SCHEMA } from './login-form.lib';

import type { FC } from 'react';

export const LoginForm: FC = () => {
  const form = useForm({
    resolver: zodResolver(LOGIN_FORM_SCHEMA),
    defaultValues: LOGIN_DEFAULT_VALUES,
  });

  const { handleSubmit } = form;

  const handleFormSubmit = handleSubmit((formValues) => {
    // eslint-disable-next-line no-console
    console.log(formValues);
  });

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={handleFormSubmit} className='space-y-4'>
        <FormInput
          id={LOGIN_FIELDS.LOGIN}
          name={LOGIN_FIELDS.LOGIN}
          label='Логин'
          required
          autoCorrect='off'
          autoComplete='login'
          autoCapitalize='none'
        />
        <FormPasswordInput
          id={LOGIN_FIELDS.PASSWORD}
          name={LOGIN_FIELDS.PASSWORD}
          label='Пароль'
          required
          autoCapitalize='none'
          autoComplete='password'
          autoCorrect='off'
        />
        <Button type='submit' className='mt-2 w-full'>
          Вход в систему
        </Button>
      </form>
    </FormProvider>
  );
};
