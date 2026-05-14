import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type { BaseWorklogsQueries, GetWorklog, PostWorklog } from './worklog.interface';

export const worklogApi = {
  getList: async ({ ...queries }: BaseWorklogsQueries, signal: AbortSignal) => {
    const response = await httpClient.get<GetWorklog[]>(API_ROUTES.ROOT_WORKLOGS.absPath, {
      params: queries,
      signal,
    });

    return response.data;
  },

  create: async (data: PostWorklog) => {
    const response = await httpClient.post<void>(API_ROUTES.ROOT_WORKLOGS.absPath, data);

    return response.data;
  },
};
