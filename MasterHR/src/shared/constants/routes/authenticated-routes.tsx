import { Navigate } from 'react-router-dom';

import { NotFound } from '@/pages/not-found-page';
import { lazyImport } from '@/shared/lib';

import { getMetaByKey, ROUTES_META } from './router-meta';

import type { RouteObject } from 'react-router-dom';

const { AuthenticatedLayout } = lazyImport(() => import('@/pages/authenticated-layout'), 'AuthenticatedLayout');

export type RouteHandle = {
  label?: string;
  icon?: React.ComponentType;
  permissions?: Undefinable<string>[];
  dataId?: string;
};

export type AppRouteObject = Omit<RouteObject, 'handle' | 'children'> & {
  handle?: RouteHandle;
  children?: AppRouteObject[];
};

export const AUTHENTICATED_ROUTES: AppRouteObject = {
  path: ROUTES_META.ROOT.path,
  element: <AuthenticatedLayout />,
  children: [
    {
      index: true,
      element: <Navigate to={ROUTES_META.ROOT_HOME.absPath} replace />,
    },

    {
      path: ROUTES_META.ROOT_NOT_FOUND.path,
      element: <NotFound />,
    },

    {
      path: ROUTES_META.ROOT_HOME.path,
      // element: <HomePage />,
      handle: getMetaByKey(ROUTES_META.ROOT_HOME),
    },
  ],
};
