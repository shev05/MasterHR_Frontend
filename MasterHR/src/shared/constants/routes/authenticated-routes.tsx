import { Navigate } from 'react-router-dom';

import { NotFound } from '@/pages/not-found-page';
import { lazyImport } from '@/shared/lib';

import { getMetaByKey, ROUTES_META } from './router-meta';

import type { RouteObject } from 'react-router-dom';

const { AuthenticatedLayout } = lazyImport(() => import('@/pages/authenticated-layout'), 'AuthenticatedLayout');

const { HomePage } = lazyImport(() => import('@/pages/home'), 'HomePage');

const { ProjectPage } = lazyImport(() => import('@/pages/administration/project'), 'ProjectPage');
const { UserActivatorPage } = lazyImport(() => import('@/pages/administration/user-activator'), 'UserActivatorPage');
const { TagsPage } = lazyImport(() => import('@/pages/administration/tags'), 'TagsPage');
const { UserPage } = lazyImport(() => import('@/pages/administration/user'), 'UserPage');

const { ProjectDetailPage } = lazyImport(
  () => import('@/pages/administration/project/ui/project-detail'),
  'ProjectDetailPage'
);
const { UserDetailPage } = lazyImport(() => import('@/pages/administration/user/ui/user-detail'), 'UserDetailPage');

const { ComponentsPage } = lazyImport(() => import('@/pages/components'), 'ComponentsPage');

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
      element: <HomePage />,
      handle: getMetaByKey(ROUTES_META.ROOT_HOME),
    },

    {
      path: ROUTES_META.ROOT_ADMINISTRATION.path,
      handle: getMetaByKey(ROUTES_META.ROOT_ADMINISTRATION),
      children: [
        {
          path: ROUTES_META.ROOT_ADMINISTRATION_USERS.path,
          children: [
            {
              path: ROUTES_META.ROOT_ADMINISTRATION_USERS_USER_ID.path,
              handle: getMetaByKey(ROUTES_META.ROOT_ADMINISTRATION_USERS_USER_ID),
              element: <UserDetailPage />,
            },
            {
              index: true,
              element: <UserPage />,
              handle: getMetaByKey(ROUTES_META.ROOT_ADMINISTRATION_USERS),
            },
          ],
        },
        {
          path: ROUTES_META.ROOT_ADMINISTRATION_PROJECT.path,
          children: [
            {
              path: ROUTES_META.ROOT_ADMINISTRATION_PROJECT_PROJECT_ID.path,
              handle: getMetaByKey(ROUTES_META.ROOT_ADMINISTRATION_PROJECT_PROJECT_ID),
              element: <ProjectDetailPage />,
            },
            {
              index: true,
              element: <ProjectPage />,
              handle: getMetaByKey(ROUTES_META.ROOT_ADMINISTRATION_PROJECT),
            },
          ],
        },
        {
          path: ROUTES_META.ROOT_ADMINISTRATION_TAGS.path,
          handle: getMetaByKey(ROUTES_META.ROOT_ADMINISTRATION_TAGS),
          element: <TagsPage />,
        },
        {
          path: ROUTES_META.ROOT_ADMINISTRATION_USER_ACTIVATOR.path,
          handle: getMetaByKey(ROUTES_META.ROOT_ADMINISTRATION_USER_ACTIVATOR),
          element: <UserActivatorPage />,
        },
      ],
    },

    {
      path: ROUTES_META.ROOT_COMPONENTS.path,
      element: <ComponentsPage />,
      handle: getMetaByKey(ROUTES_META.ROOT_COMPONENTS),
    },
  ],
};
