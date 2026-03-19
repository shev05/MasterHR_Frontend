import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { API_ROUTES } from '@/api/api-routes';
import { getApiBaseKeys } from '@/shared/lib';
import { queryClient } from '@/api/query-client';

import { tagsApi } from './tags.api';

import type { GetTags, GetTagsPaginatedResponse, GetTagsResponse, TagsQueries } from './tags.interface';
import type { BaseQueryListHookProps, QueryOptions } from '@/shared/interface';

const tagsKeys = getApiBaseKeys(API_ROUTES.ROOT_TAGS.absPath);

export const useTagsList = (
  { queries = {} }: BaseQueryListHookProps<TagsQueries> = {},
  queryOptions?: QueryOptions<GetTagsPaginatedResponse, ReturnType<typeof tagsKeys.list>>
) => {
  return useQuery({
    queryKey: tagsKeys.list(queries),
    queryFn: ({ signal }) => tagsApi.getList(queries, signal),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
};

type QueryHookProps = {
  tagId: GetTags['id'];
};

export const useTag = (
  { tagId }: QueryHookProps,
  queryOptions?: QueryOptions<GetTagsResponse, ReturnType<typeof tagsKeys.detail>>
) => {
  return useQuery({
    queryKey: tagsKeys.detail(tagId),
    queryFn: ({ signal }) => tagsApi.get(tagId, signal),
    ...queryOptions,
  });
};

export const useTagCreate = () => {
  return useMutation({
    mutationFn: tagsApi.create,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.base });
    },
  });
};

export const useTagDelete = () => {
  return useMutation({
    mutationFn: tagsApi.delete,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.base });
    },
  });
};
