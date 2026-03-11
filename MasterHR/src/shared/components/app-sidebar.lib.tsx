import { transformRoutesForNavigation } from '@/shared/lib/transform-routes-for-navigation';
import { ROUTES_META } from '@/shared/constants/routes/router-meta';

import type { GetPermission } from '@/api/endpoints/permission';
import type { AppRouteObject } from '@/shared/constants/routes/authenticated-routes';

type ChildMenuItem = NonNullable<AppRouteObject['handle']> & { path: AppRouteObject['path'] };

type ParentMenuItem = ChildMenuItem & {
  items: ChildMenuItem[];
};

export type MenuItem = ParentMenuItem | ChildMenuItem;

export const isAccordionItemGuard = (item: ChildMenuItem): item is ParentMenuItem => 'items' in item;

export const PREPARED_NAVIGATION = transformRoutesForNavigation(ROUTES_META.ROOT);

export const filterAllowedItems = (
  userPermissions: GetPermission['name'][],
  items: MenuItem[] | undefined = PREPARED_NAVIGATION
) => {
  if (!items || !userPermissions) return items;

  return items?.reduce((acc, item) => {
    if (item?.permissions && Array.isArray(item.permissions)) {
      const isHasAccess = item.permissions.some((itemPerm) =>
        userPermissions.some((permName) => permName === itemPerm)
      );

      if (!isHasAccess) {
        return acc;
      }
    }

    if (!isAccordionItemGuard(item)) {
      acc.push({ ...item });

      return acc;
    }

    const allowedItems = filterAllowedItems(userPermissions, item.items);

    if (allowedItems?.length && allowedItems?.length > 0) {
      acc.push({ ...item, items: allowedItems });
    }

    return acc;
  }, [] as MenuItem[]);
};
