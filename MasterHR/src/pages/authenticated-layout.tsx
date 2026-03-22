import { Outlet } from 'react-router-dom';

import { SidebarProvider } from '@/providers';
import { useIsMobile } from '@/shared/hooks';
import { AppSidebar } from '@/shared/components/app-sidebar';
import { SidebarTrigger, SuspenseWrapper } from '@/shared/components/ui';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { ErrorBoundaryFallback } from '@/shared/components/error-boundary-fallback';
import { PLACEHOLDERS } from '@/shared/constants/placeholders';
import { UseMe } from '@/api/endpoints/user';

import type { FC } from 'react';

export const AuthenticatedLayout: FC = () => {
  const isMobile = useIsMobile();

  const { data: currentUser } = UseMe();

  return (
    <SidebarProvider>
      <ErrorBoundary fallback={<ErrorBoundaryFallback text={PLACEHOLDERS.sidebarError} />}>
        <AppSidebar userPermissions={[]} user={currentUser} />
      </ErrorBoundary>
      <main className='flex h-screen w-full flex-col justify-between gap-2 overflow-hidden p-1 px-2'>
        <ErrorBoundary fallback={<ErrorBoundaryFallback text={PLACEHOLDERS.headerError} />}>
          <header className='flex w-full flex-col items-center justify-between gap-1'>
            <div className='flex w-full items-center gap-2'>
              <SuspenseWrapper condition={isMobile}>
                <SidebarTrigger />
              </SuspenseWrapper>
            </div>
          </header>
        </ErrorBoundary>
        <section className='relative flex h-full flex-col gap-2 overflow-hidden'>
          <Outlet />
        </section>
      </main>
    </SidebarProvider>
  );
};
