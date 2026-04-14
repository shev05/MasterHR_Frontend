import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type { BaseSkills, GetSkills, GetSkillsResponse } from './skills.interface';
import type { GetUser } from '@/api/endpoints/user';

export const skillsApi = {
  getList: async (userId: GetUser['id'], signal: AbortSignal) => {
    const response = await httpClient.get<GetSkillsResponse>(
      API_ROUTES.ROOT_USER_USERID_SKILLS.generatePath({ userId }),
      {
        signal,
      }
    );

    return response.data;
  },

  getListMe: async (signal: AbortSignal) => {
    const response = await httpClient.get<GetSkillsResponse>(API_ROUTES.ROOT_USER_ME_SKILLS.absPath, {
      signal,
    });

    return response.data;
  },

  create: async (data: BaseSkills) => {
    const response = await httpClient.post<void>(API_ROUTES.ROOT_USER_ME_SKILLS.absPath, data);

    return response.data;
  },

  delete: async (skillId: GetSkills['id']) => {
    const response = await httpClient.delete<void>(API_ROUTES.ROOT_USER_ME_SKILLS.absPath, {
      params: { SkillId: skillId },
    });

    return response.data;
  },
};
