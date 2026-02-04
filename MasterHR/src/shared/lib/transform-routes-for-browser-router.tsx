import { lazy } from 'react';

import type { RouteHierarchyTransformedType, RouteHierarchyType } from '@/shared/builders';
import type { RouteObject } from 'react-router-dom';

const PrivateRoute = lazy(() =>
  import('@/shared/components/private-route').then((module) => ({ default: module.PrivateRoute }))
);

export const transformRoutesForBrowserRouter = (
  route: RouteHierarchyTransformedType | RouteHierarchyType[string]
): RouteObject => {
  const { path, children, element, index, label, permissions } = route;

  const protectedElement = element && <PrivateRoute permissions={permissions}>{element}</PrivateRoute>;

  if (index) {
    const indexRoute: RouteObject = {
      index: true,
      element,
    };

    if (label) {
      indexRoute.handle = {
        crumb: label,
      };
    }
    return indexRoute;
  }

  const nonIndexRoute: RouteObject = {
    path,
    element: protectedElement,
  };

  if (label) {
    nonIndexRoute.handle = {
      crumb: { label },
    };
  }

  if (children) {
    nonIndexRoute.children = Object.values(children).map((child) => transformRoutesForBrowserRouter(child));
  }

  return nonIndexRoute;
};
