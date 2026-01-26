import { NoPermissions } from '@/pages/no-permissions-page';

import { CenteredSpinner } from './centered-spinner';

import type { FC, ReactNode } from 'react';

type PrivateRouteProps = {
  permissions?: Undefinable<string>[];
  children: ReactNode;
};

export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  // const { isAuth } = useAuthStore();
  // const { curentUserPermissions, isFetching } = useCurrentUser({ enabled: isAuth });

  const isFetching = false;
  if (isFetching) {
    return <CenteredSpinner />;
  }

  const hasPermission = true;
  // !permissions ||
  // permissions.some((permission) => curentUserPermissions?.find((permissionName) => permission === permissionName));

  if (!hasPermission) {
    return <NoPermissions />;
  }

  return children;
};
