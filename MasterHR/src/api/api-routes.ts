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
      USER: {
        path: 'User',
        children: {
          ME: {
            path: 'me',
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
        children: {
          USER_ID: {
            path: ':userId',
            children: {
              ACTIVATE_USER: {
                path: 'activate-user',
              },
            },
          },
        },
      },
    },
  },
} as const);
