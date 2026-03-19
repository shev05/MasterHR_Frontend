import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type { GetTags, GetTagsPaginatedResponse, GetTagsResponse, PostTags, TagsQueries } from './tags.interface';

export const tagsApi = {
  getList: async ({ ...queries }: TagsQueries, signal: AbortSignal) => {
    const response = await httpClient.get<GetTagsPaginatedResponse>(API_ROUTES.ROOT_TAGS.absPath, {
      params: queries,
      signal,
    });

    return response.data;
  },

  get: async (tagId: GetTags['id'], signal: AbortSignal) => {
    const response = await httpClient.get<GetTagsResponse>(API_ROUTES.ROOT_TAGS_TAG_ID.generatePath({ tagId }), {
      signal,
    });

    return response.data;
  },

  create: async (data: PostTags) => {
    const response = await httpClient.post<GetTagsResponse>(API_ROUTES.ROOT_TAGS.absPath, data);

    return response.data;
  },

  delete: async (tagId: GetTags['id']) => {
    const response = await httpClient.delete<GetTagsResponse>(API_ROUTES.ROOT_TAGS_TAG_ID.generatePath({ tagId }));

    return response.data;
  },
};
