import { generatePath as generatePathOriginal } from 'react-router-dom';

import type { RouteHierarchyNode, SVGComponent, InferRouteKeys } from '@/shared/interface';
import type { JSX } from 'react';

export type RouteRecordSharedType = {
  label?: string;
  icon?: SVGComponent;
  permissions?: Array<string>;
  dataId?: string;
  element?: JSX.Element;
  // flag for https://reactrouter.com/6.30.0/route/route#index*/
  index?: boolean;
};

export type RouteHierarchyType = RouteHierarchyNode<RouteRecordSharedType>;

export type RouteHierarchyTransformedType = {
  key: string;
  parentKey: string;
  path?: string;
  absPath: string;
  children?: RouteHierarchyType;

  /* Get direct (by default) or all children of a route.
   *
   * If indirect === false: ROOT.getChildren() = {ROOT_MATERIAL_MANAGER, ROOT_MENUS_MANAGER}
   *
   * If indirect === true: ROOT.getChildren() = {ROOT_MATERIAL_MANAGER, ROOT_MATERIAL_MANAGER_CREATE, etc.}
   *
   * If comparator passed, sorts children. See sort() for comparator usage
   */
  getChildren: (
    indirect?: boolean,
    comparator?: (a: RouteHierarchyTransformedType, b: RouteHierarchyTransformedType) => number
  ) => Array<RouteHierarchyTransformedType>;
  getChildrenPermissions: () => Array<string | undefined>;

  generatePath: (params: Record<string, string | number>) => string;
} & RouteRecordSharedType;

type InferRoutePaths<T extends RouteHierarchyType, Parent extends string = ''> = InferRouteKeys<T, Parent>;

type TransformedRoutesType<T extends RouteHierarchyType> = {
  [P in InferRoutePaths<T>]: RouteHierarchyTransformedType;
};

function pathJoin(parts: string[], sep = '/'): string {
  const replace = new RegExp(sep + '{1,}', 'g');
  return parts.join(sep).replace(replace, sep);
}

export const asTransformedRoutes = <T extends RouteHierarchyType>(hierarchy: T): TransformedRoutesType<T> => {
  const accumulateRoutes = (
    obj: RouteHierarchyType,
    parentPath: string = '',
    parentKey: string = ''
  ): Record<string, RouteHierarchyTransformedType> => {
    return Object.entries(obj).reduce<Record<string, RouteHierarchyTransformedType>>((acc, [key, value]) => {
      const currentKey = parentKey ? `${parentKey}_${key}` : key;
      if (value.children) {
        const accumulated = accumulateRoutes(value.children, pathJoin([parentPath, value.path || '']), currentKey);
        Object.assign(acc, accumulated);
      }
      const absPath = pathJoin([parentPath, value.path || '']);
      acc[currentKey] = {
        ...value,
        key: currentKey,
        parentKey: parentKey,
        path: value.path,
        absPath: absPath,
        index: value.index,
        permissions: value.permissions,
        children: value.children,
        getChildren: () => [],
        generatePath: () => absPath,
        getChildrenPermissions: () => [],
      };
      return acc;
    }, {});
  };

  const result = accumulateRoutes(hierarchy);

  for (const routeKey in result) {
    result[routeKey].getChildren = (indirect = false, comparator?) => {
      return Object.values(result)
        .filter((val) => (indirect ? val.key.startsWith(routeKey) : val.parentKey === routeKey) && val.key !== routeKey)
        .sort(comparator);
    };

    result[routeKey].getChildrenPermissions = () => {
      return Object.values(result)
        .filter((val) => val.parentKey === routeKey && val.key !== routeKey)
        .filter((val) => val.permissions)
        .flatMap((val) => val.permissions);
    };

    result[routeKey].generatePath = (params) =>
      generatePathOriginal(
        result[routeKey].absPath,
        Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
          acc[k] = `${v}`;
          return acc;
        }, {})
      );
  }

  return result as TransformedRoutesType<T>;
};
