import { createBrowserRouter } from 'react-router-dom';

import { NotFound } from '@/pages/not-found-page';
import { asTransformedRoutes } from '@/shared/builders';
import { lazyImport, transformRoutesForBrowserRouter, transformRoutesForNavigation } from '@/shared/lib';

const { AuthenticatedLayout } = lazyImport(() => import('@/pages/authenticated-layout'), 'AuthenticatedLayout');

export const AUTHENTICATED_ROUTES = asTransformedRoutes({
  ROOT: {
    path: '/',
    element: <AuthenticatedLayout />,
    label: 'Главная страница',
    children: {
      NOT_FOUND: {
        path: '*',
        label: 'Страница не найдена',
        element: <NotFound />,
      },
    },
  },
} as const);

export const AUTHENTICATED_ROUTER = createBrowserRouter([transformRoutesForBrowserRouter(AUTHENTICATED_ROUTES.ROOT)]);
export const AUTHENTICATED_MENU_ITEMS = transformRoutesForNavigation(AUTHENTICATED_ROUTES.ROOT);
