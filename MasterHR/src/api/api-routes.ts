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
          REFRESH_TOKEN: {
            path: 'refresh-token',
          },
        },
      },
      USER: {
        path: 'User',
        children: {
          USERID: {
            path: ':userId',
            children: {
              PROFILE: {
                path: 'profile',
              },
            },
          },
          ME: {
            path: 'me',
          },
          EXTRACT_SKILLS: {
            path: 'extract-skills',
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
      PROJECT: {
        path: 'Project',
        children: {
          PROJECT_ID: {
            path: ':projectId',
            children: {
              USERS: {
                path: 'users',
              },
              TAGS: {
                path: 'tags',
              },
              INFO: {
                path: 'info',
              },
              EMPLOYEES: {
                path: 'empoyees',
              },
              MANAGER: {
                path: 'manager',
              },
            },
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
