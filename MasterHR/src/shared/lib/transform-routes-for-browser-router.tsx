import type { RouteObject } from 'react-router-dom';
import type { AppRouteObject } from '@/shared/constants/routes/authenticated-routes';

export const transformRoutesForBrowserRouter = (route: AppRouteObject): RouteObject => {
  const { path, children, element, index, handle } = route;

  const label = handle?.label;

  const protectedElement = element;

  if (index) {
    const indexRoute: RouteObject = {
      index: true,
      element,
    };

    if (label) {
      indexRoute.handle = {
        crumb: { label },
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
