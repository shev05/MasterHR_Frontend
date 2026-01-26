import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import './index.css';

import { queryClient } from '@/api/query-client';
import { ThemeProvider } from '@/providers';
import { store } from '@/store';
import { CenteredSpinner, ErrorBoundary } from '@/shared/components';
import { UNAUTHENTICATED_ROUTER } from '@/shared/constants/routes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Provider store={store}>
          <ErrorBoundary>
            <Suspense fallback={<CenteredSpinner />}>
              <RouterProvider router={UNAUTHENTICATED_ROUTER} />
            </Suspense>
          </ErrorBoundary>
        </Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
