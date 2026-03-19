import { asTransformedRoutes } from '@/shared/builders';

export const API_ROUTES = asTransformedRoutes({
  ROOT: {
    path: '/',
    children: {
      ACCOUNT: {
        path: 'account',
        children: {
          LOGIN: {
            path: 'login',
          },
        },
      },
      TAGS: {
        path: 'tags',
        children: {
          TAG_ID: {
            path: ':tagId',
          },
        },
      },
    },
  },
} as const);
