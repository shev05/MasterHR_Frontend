import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';

import { deafultTab, LOGIN_PAGES_TABS } from './login.meta';

import type { FC } from 'react';

export const LoginPage: FC = () => {
  return (
    <section className='flex h-full items-center justify-center'>
      <Card className='min-w-xs flex w-full max-w-sm flex-col justify-center'>
        <Tabs defaultValue={deafultTab}>
          <CardHeader className='text-center'>
            <TabsList className='mx-auto'>
              {LOGIN_PAGES_TABS.map((item) => {
                return (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <CardDescription>Введите ваши данные</CardDescription>
          </CardHeader>
          <CardContent>
            {LOGIN_PAGES_TABS.map((item) => {
              return (
                <TabsContent key={item.value} value={item.value}>
                  {item.content}
                </TabsContent>
              );
            })}
          </CardContent>
        </Tabs>
      </Card>
    </section>
  );
};
