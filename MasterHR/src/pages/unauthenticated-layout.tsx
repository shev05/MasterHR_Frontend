import { Outlet } from 'react-router-dom';

import backImg from '@/assets/images/back.webp';
import { ModeToggle } from '@/shared/components';

import type { FC } from 'react';

export const UnauthenticatedLayout: FC = () => {
  return (
    <main className='relative flex h-screen w-full p-3'>
      <div className='rounded-4xl hidden h-full overflow-hidden lg:flex lg:w-3/5'>
        <img
          style={{ objectPosition: '-100px 100%' }}
          src={backImg}
          className='h-full w-full object-cover'
          alt='login poster'
        />
      </div>
      <section className='lg:min-w-2/5 flex h-full w-full flex-col items-center justify-center lg:w-fit'>
        <div className='self-end'>
          <ModeToggle />
        </div>

        <Outlet />
      </section>
    </main>
  );
};
