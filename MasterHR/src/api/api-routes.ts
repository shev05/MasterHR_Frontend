import { asTransformedRoutes } from '@/shared/builders';

export const API_ROUTES = asTransformedRoutes({
  ROOT: {
    path: '/',
    children: {
      ACCOUNT: {
        path: 'Account',
        children: {
          LOGIN: {
            path: 'login',
          },
        },
      },
      TAGS: {
        path: 'Tags',
        children: {
          TAG_ID: {
            path: ':tagId',
          },
        },
      },
      USER_ACTIVATOR: {
        path: 'UserActivator',
      },
    },
  },
} as const);
