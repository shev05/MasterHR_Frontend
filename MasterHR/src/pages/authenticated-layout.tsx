import { Outlet } from 'react-router-dom';

import { AppSidebar, ModeToggle, Separator, SidebarTrigger, SuspenseWrapper } from '@/shared/components';
import { SidebarProvider } from '@/providers';
import { useIsMobile } from '@/shared/hooks';

import type { FC } from 'react';

export const AuthenticatedLayout: FC = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex h-screen w-full flex-col justify-between gap-2 overflow-hidden p-1 px-2'>
        <header className='flex w-full flex-col items-center justify-between gap-1'>
          <div className='flex w-full items-center gap-2'>
            <SuspenseWrapper condition={isMobile}>
              <SidebarTrigger />
            </SuspenseWrapper>
            <ModeToggle />
          </div>
          <Separator />
        </header>
        <section className='relative flex h-full flex-col justify-between gap-2 overflow-hidden'>
          <Outlet />
        </section>
      </main>
    </SidebarProvider>
  );
};
