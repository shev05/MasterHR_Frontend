import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import './index.css';

import { queryClient } from '@/api/query-client';
import { DialogProvider, ThemeProvider } from '@/providers';
import { Toaster } from '@/shared/components/app-toaster';
import { UNAUTHENTICATED_ROUTER, AUTHENTICATED_ROUTER } from '@/shared/constants/routes';
import { useUserStore } from '@/store';
import { ToastProvider } from '@/shared/components/ui';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { CenteredSpinner } from '@/shared/components/centered-spinner';
import { AlertDialogProvider } from '@/providers/alert-dialog-provider';

function App() {
  const { isAuth } = useUserStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <Toaster />
        </ToastProvider>
        <AlertDialogProvider>
          <DialogProvider>
            <ErrorBoundary>
              <Suspense fallback={<CenteredSpinner />}>
                <RouterProvider router={isAuth ? AUTHENTICATED_ROUTER : UNAUTHENTICATED_ROUTER} />
              </Suspense>
            </ErrorBoundary>
          </DialogProvider>
        </AlertDialogProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
