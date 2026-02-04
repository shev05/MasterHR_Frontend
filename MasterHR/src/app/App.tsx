import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import './index.css';

import { queryClient } from '@/api/query-client';
import { DialogProvider, ThemeProvider } from '@/providers';
import { CenteredSpinner, ErrorBoundary } from '@/shared/components';
import { UNAUTHENTICATED_ROUTER, AUTHENTICATED_ROUTER } from '@/shared/constants/routes';
import { useUserStore } from '@/store';

function App() {
  const { isAuth } = useUserStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DialogProvider>
          <ErrorBoundary>
            <Suspense fallback={<CenteredSpinner />}>
              <RouterProvider router={isAuth ? AUTHENTICATED_ROUTER : UNAUTHENTICATED_ROUTER} />
            </Suspense>
          </ErrorBoundary>
        </DialogProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
