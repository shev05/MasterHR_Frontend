import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type {
  AddUserProject,
  GetProject,
  GetProjectPaginatedResponse,
  GetProjectResponse,
  GetUsersProject,
  PatchInfoProject,
  PatchTagsProject,
  PathcUsersProject,
  ProjectQueries,
  ProjectTag,
} from './project.interface';

type ApiEntityId = GetProject['id'];

export const projectApi = {
  getList: async ({ ...queries }: ProjectQueries, signal: AbortSignal) => {
    const response = await httpClient.get<GetProjectPaginatedResponse>(API_ROUTES.ROOT_PROJECT.absPath, {
      params: queries,
      signal,
    });

    return response.data;
  },

  get: async (projectId: GetProject['id'], signal: AbortSignal) => {
    const response = await httpClient.get<GetProject>(API_ROUTES.ROOT_PROJECT_PROJECT_ID.generatePath({ projectId }), {
      signal,
    });

    return response.data;
  },

  create: async (data: FormData) => {
    const response = await httpClient.post<GetProjectResponse>(API_ROUTES.ROOT_PROJECT.absPath, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  addUser: async ({ projectId, user }: { projectId: GetProject['id']; user: AddUserProject }) => {
    const response = await httpClient.post<void>(API_ROUTES.ROOT_PROJECT_PROJECT_ID_USER.generatePath({ projectId }), {
      user,
    });

    return response.data;
  },

  getUsers: async (projectId: GetProject['id'], signal: AbortSignal) => {
    const response = await httpClient.get<GetUsersProject>(
      API_ROUTES.ROOT_PROJECT_PROJECT_ID_USERS.generatePath({ projectId }),
      {
        signal,
      }
    );

    return response.data;
  },

  getTags: async (projectId: GetProject['id'], signal: AbortSignal) => {
    const response = await httpClient.get<ProjectTag>(
      API_ROUTES.ROOT_PROJECT_PROJECT_ID_TAGS.generatePath({ projectId }),
      {
        signal,
      }
    );

    return response.data;
  },

  updateUsers: async ({ data, projectId }: { data: PathcUsersProject; projectId: ApiEntityId }) => {
    const response = await httpClient.patch<void>(
      API_ROUTES.ROOT_PROJECT_PROJECT_ID_USERS.generatePath({ projectId }),
      {
        ...data,
      }
    );

    return response.data;
  },

  updateTags: async ({ data, projectId }: { data: PatchTagsProject; projectId: ApiEntityId }) => {
    const response = await httpClient.patch<void>(API_ROUTES.ROOT_PROJECT_PROJECT_ID_TAGS.generatePath({ projectId }), {
      ...data,
    });

    return response.data;
  },

  updateInfo: async ({ data, projectId }: { data: PatchInfoProject; projectId: ApiEntityId }) => {
    const response = await httpClient.patch<void>(API_ROUTES.ROOT_PROJECT_PROJECT_ID_INFO.generatePath({ projectId }), {
      ...data,
    });

    return response.data;
  },

  delete: async (projectId: GetProject['id']) => {
    const response = await httpClient.delete<void>(API_ROUTES.ROOT_PROJECT_PROJECT_ID.generatePath({ projectId }));

    return response.data;
  },
};
