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
          MATCH: {
            path: 'match',
          },
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
            children: {
              SKILLS: {
                path: 'skills',
              },
            },
          },
          AVATAR: {
            path: 'avatar',
          },
        },
      },
      SKILLS: {
        path: 'skills',
        children: {
          EXTRACT_SKILLS: {
            path: 'extract-skills',
          },
          USERID: {
            path: ':userId',
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
              USER: {
                path: 'user',
              },
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
