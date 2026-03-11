import { Outlet } from 'react-router-dom';

import { SidebarProvider } from '@/providers';
import { useIsMobile } from '@/shared/hooks';
import { AppSidebar } from '@/shared/components/app-sidebar';
import { Separator, SidebarTrigger, SuspenseWrapper } from '@/shared/components/ui';
import { ModeToggle } from '@/shared/components/mode-toggle';

import type { FC } from 'react';

export const AuthenticatedLayout: FC = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <AppSidebar userPermissions={[]} />
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
