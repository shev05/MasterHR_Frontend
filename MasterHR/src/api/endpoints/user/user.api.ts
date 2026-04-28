import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type {
  GetUser,
  GetUserPaginatedResponse,
  MatchProject,
  MatchProjectRepsonse,
  PutUser,
  UserQueries,
} from './user.interface';

export const userApi = {
  getList: async ({ ...queries }: UserQueries, signal: AbortSignal) => {
    const response = await httpClient.get<GetUserPaginatedResponse>(API_ROUTES.ROOT_USER.absPath, {
      params: queries,
      signal,
    });

    return response.data;
  },

  get: async (userId: GetUser['id'], signal: AbortSignal) => {
    const response = await httpClient.get<GetUser>(API_ROUTES.ROOT_USER_USERID_PROFILE.generatePath({ userId }), {
      signal,
    });

    return response.data;
  },

  me: async (signal: AbortSignal) => {
    const response = await httpClient.get<GetUser>(API_ROUTES.ROOT_USER_ME.absPath, {
      signal,
    });

    return response.data;
  },

  update: async ({ data, userId }: { data: PutUser; userId: GetUser['id'] }) => {
    const response = await httpClient.put<null>(API_ROUTES.ROOT_USER_USERID.generatePath({ userId }), {
      ...data,
    });

    return response.data;
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('File', file);

    const response = await httpClient.post<void>(API_ROUTES.ROOT_USER_AVATAR.absPath, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  match: async (data: MatchProject) => {
    const response = await httpClient.post<MatchProjectRepsonse>(API_ROUTES.ROOT_USER_MATCH.absPath, { ...data });

    return response.data;
  },
};
