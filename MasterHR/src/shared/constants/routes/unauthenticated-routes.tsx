import { Navigate } from 'react-router-dom';

import { lazyImport } from '@/shared/lib';

import { ROUTES_META } from './router-meta';

const { UnauthenticatedLayout } = lazyImport(() => import('@/pages/unauthenticated-layout'), 'UnauthenticatedLayout');

const { LoginPage } = lazyImport(() => import('@/pages/login/login'), 'LoginPage');

export const UNAUTHENTICATED_ROUTES = {
  path: ROUTES_META.ROOT.absPath,
  element: <UnauthenticatedLayout />,
  children: [
    { path: ROUTES_META.ROOT_NOT_FOUND.absPath, element: <Navigate to={ROUTES_META.ROOT.absPath} replace={true} /> },
    { path: ROUTES_META.ROOT.absPath, element: <LoginPage /> },
  ],
};
