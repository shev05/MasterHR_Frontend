import type { RouteHierarchyTransformedType } from '@/shared/builders';

//TODO: only two levels, rewrite if need for big nesting
export const transformRoutesForNavigation = (route: RouteHierarchyTransformedType) => {
  return route
    .getChildren()
    .filter((item) => item.path !== '*' && !item.index)
    .map((item) => {
      const baseItem = {
        label: item.label,
        path: item.absPath,
        icon: item.icon,
        permissions: item.permissions,
      };

      if (item.children) {
        const childrenItems = Object.values(item.children)
          .filter((child) => child.path !== '*' && !child.index)
          .map((child) => {
            return {
              label: child.label,
              path: `${item.absPath}/${child.path}`,
              icon: child.icon,
              permissions: child.permissions,
            };
          });

        if (childrenItems.length > 0) {
          return {
            ...baseItem,
            items: childrenItems,
          };
        }
      }

      return baseItem;
    });
};
