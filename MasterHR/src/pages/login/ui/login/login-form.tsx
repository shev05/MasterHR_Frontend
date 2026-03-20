import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui';
import { toast } from '@/shared/components/app-toaster';
import { FormInput, FormPasswordInput } from '@/shared/components/controls';
import { useLogin } from '@/api/endpoints/login';
import { addIsAuth } from '@/store';
import { ROUTES_META } from '@/shared/constants/routes/router-meta';
import { parseApiErrors } from '@/api/http-client';
import { yupCustomResolver } from '@/shared/lib/yup-custom-resolver';

import { LOGIN_DEFAULT_VALUES, LOGIN_FIELDS, LOGIN_FORM_SCHEMA } from './login-form.lib';

import type { FC } from 'react';
import type { LoginFormValue } from './login-form.lib';

export const LoginForm: FC = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormValue>({
    resolver: yupCustomResolver({ validationSchema: LOGIN_FORM_SCHEMA }),
    defaultValues: LOGIN_DEFAULT_VALUES,
  });

  const { handleSubmit, setError } = form;

  const handleFormSubmit = handleSubmit((formValues) => {
    login(formValues, {
      onSuccess: () => {
        toast.success('Вы авторизованы');
        addIsAuth();
        navigate(ROUTES_META.ROOT.absPath);
      },
      onError: (error) => parseApiErrors({ error, setError }),
    });
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
          autoComplete='email'
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
        <Button type='submit' className='mt-2 w-full' disabled={isPending}>
          Вход в систему
        </Button>
      </form>
    </FormProvider>
  );
};
