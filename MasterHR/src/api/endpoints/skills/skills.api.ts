import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type { BaseSkills, GetSkills, GetSkillsResponse } from './skills.interface';
import type { GetExtractSkills, GetUser } from '@/api/endpoints/user';

export const skillsApi = {
  getList: async (userId: GetUser['id'], signal: AbortSignal, searchBy?: string) => {
    const response = await httpClient.get<GetSkillsResponse>(API_ROUTES.ROOT_SKILLS_USERID.generatePath({ userId }), {
      params: { searchBy },
      signal,
    });

    return response.data;
  },

  create: async (data: BaseSkills, userId: GetUser['id']) => {
    const response = await httpClient.post<void>(API_ROUTES.ROOT_SKILLS_USERID.generatePath({ userId }), data);

    return response.data;
  },

  delete: async (skillId: GetSkills['id'], userId: GetUser['id']) => {
    const response = await httpClient.delete<void>(API_ROUTES.ROOT_SKILLS_USERID.generatePath({ userId }), {
      data: skillId,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },

  resumeFile: async ({ formData, userId }: { formData: FormData; userId: GetUser['id'] }) => {
    const response = await httpClient.post<GetExtractSkills>(
      API_ROUTES.ROOT_SKILLS_USERID_EXTRACT_SKILLS.generatePath({ userId }),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
