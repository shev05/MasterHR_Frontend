import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';

import { LoginForm } from './ui';

import type { FC } from 'react';

export const LoginPage: FC = () => {
  return (
    <section className='flex h-full items-center justify-center'>
      <Card className='min-w-xs flex w-full max-w-sm flex-col justify-center'>
        <CardHeader className='text-center'>
          <CardTitle>Авторизация</CardTitle>
          <CardDescription>Введите ваши данные</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </section>
  );
};
