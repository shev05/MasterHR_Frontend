import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { API_ROUTES } from '@/api/api-routes';
import { getApiBaseKeys } from '@/shared/lib';
import { queryClient } from '@/api/query-client';
import { transformDataToOptions } from '@/shared/lib/transform-data-to-options';

import { tagsApi } from './tags.api';

import type { GetTags, GetTagsPaginatedResponse, GetTagsResponse, TagsQueries } from './tags.interface';
import type { BaseQueryListHookProps, QueryOptions } from '@/shared/interface';

export const tagsKeys = getApiBaseKeys(API_ROUTES.ROOT_TAGS.absPath);

export const useTagsList = (
  { queries = {} }: BaseQueryListHookProps<TagsQueries> = {},
  queryOptions?: QueryOptions<GetTagsPaginatedResponse, ReturnType<typeof tagsKeys.list>>
) => {
  const query = useQuery({
    queryKey: tagsKeys.list(queries),
    queryFn: ({ signal }) => tagsApi.getList(queries, signal),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });

  const options = transformDataToOptions(query?.data?.list, {
    asIdKey: 'id',
    asValueKey: 'id',
    asLabelKeys: 'title',
  });

  return {
    ...query,
    options,
  };
};

type QueryHookProps = {
  tagId: GetTags['id'];
};

export const useTag = (
  { tagId }: QueryHookProps,
  queryOptions?: QueryOptions<GetTagsResponse, ReturnType<typeof tagsKeys.detail>>
) => {
  const query = useQuery({
    queryKey: tagsKeys.detail(tagId),
    queryFn: ({ signal }) => tagsApi.get(tagId, signal),
    ...queryOptions,
  });

  return {
    ...query,
  };
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
