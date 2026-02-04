import { createBrowserRouter, Navigate } from 'react-router-dom';

import { asTransformedRoutes } from '@/shared/builders';
import { lazyImport, transformRoutesForBrowserRouter } from '@/shared/lib';

const { UnauthenticatedLayout } = lazyImport(() => import('@/pages/unauthenticated-layout'), 'UnauthenticatedLayout');

const { LoginPage } = lazyImport(() => import('@/pages/login/login'), 'LoginPage');

export const UNAUTHENTICATED_ROUTES = asTransformedRoutes({
  ROOT: {
    path: '/',
    element: <UnauthenticatedLayout />,
    label: 'Главная страница',
    children: {
      NOT_FOUND: {
        path: '*',
        label: 'Not found',
        element: <Navigate to={'/'} replace={true} />,
      },
      LOGIN: { path: '/', label: 'Авторизация', element: <LoginPage /> },
    },
  },
} as const);

export const UNAUTHENTICATED_ROUTER = createBrowserRouter([
  transformRoutesForBrowserRouter(UNAUTHENTICATED_ROUTES.ROOT),
]);
