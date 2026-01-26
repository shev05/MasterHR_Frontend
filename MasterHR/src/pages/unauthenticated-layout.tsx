import { Outlet } from 'react-router-dom';

import { ModeToggle } from '@/shared/components';

import type { FC } from 'react';

export const UnauthenticatedLayout: FC = () => {
  return (
    <main className='relative flex h-screen w-full p-3'>
      <section className='flex h-full w-full flex-col items-center justify-center'>
        <div className='self-end'>
          <ModeToggle />
        </div>

        <Outlet />
      </section>
    </main>
  );
};
