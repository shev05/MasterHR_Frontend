import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/shared/components/ui';
import { toast } from '@/shared/components/app-toaster';
import { FormPasswordInput } from '@/shared/components/controls';
import { useRegister } from '@/api/endpoints/login';
import { parseApiErrors } from '@/api/http-client';
import { yupCustomResolver } from '@/shared/lib/yup-custom-resolver';
import { FormPhoneInput } from '@/shared/components/controls/number-input';
import { FormVoiceInput } from '@/shared/components/controls/voice-input';

import { REGISTER_DEFAULT_VALUES, REGISTER_FIELDS, REGISTER_FORM_SCHEMA } from './register-form.lib';

import type { FC } from 'react';
import type { RegisterFormValue } from './register-form.lib';

export const RegisterForm: FC = () => {
  const { mutate: register, isPending } = useRegister();

  const form = useForm<RegisterFormValue>({
    resolver: yupCustomResolver({ validationSchema: REGISTER_FORM_SCHEMA }),
    defaultValues: REGISTER_DEFAULT_VALUES,
  });

  const { handleSubmit, setError, reset } = form;

  const handleFormSubmit = handleSubmit((formValues) => {
    register(formValues, {
      onSuccess: () => {
        toast.success('Вы зарегистрировались, вернитесь к авторизации');
        reset();
      },
      onError: (error) => parseApiErrors({ error, setError }),
    });
  });

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={handleFormSubmit} className='space-y-4'>
        <FormVoiceInput id={REGISTER_FIELDS.NAME} name={REGISTER_FIELDS.NAME} label='Имя' required />
        <FormVoiceInput id={REGISTER_FIELDS.SURNAME} name={REGISTER_FIELDS.SURNAME} label='Фамилия' required />
        <FormVoiceInput id={REGISTER_FIELDS.PATRONYMC} name={REGISTER_FIELDS.PATRONYMC} label='Отчество' required />
        <FormPhoneInput
          id={REGISTER_FIELDS.PHONENUMBER}
          name={REGISTER_FIELDS.PHONENUMBER}
          label='Номер телефона'
          required
        />
        <FormVoiceInput
          id={REGISTER_FIELDS.EMAIL}
          name={REGISTER_FIELDS.EMAIL}
          label='Почта'
          required
          autoCorrect='off'
          autoComplete='email'
          autoCapitalize='none'
        />
        <FormPasswordInput
          id={REGISTER_FIELDS.PASSWORD}
          name={REGISTER_FIELDS.PASSWORD}
          label='Пароль'
          required
          autoCapitalize='none'
          autoComplete='password'
          autoCorrect='off'
        />
        <Button type='submit' className='mt-2 w-full' disabled={isPending}>
          Регистрация
        </Button>
      </form>
    </FormProvider>
  );
};
