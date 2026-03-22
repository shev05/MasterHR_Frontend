import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { API_ROUTES } from '@/api/api-routes';
import { getApiBaseKeys } from '@/shared/lib';
import { queryClient } from '@/api/query-client';
import { transformDataToOptions } from '@/shared/lib/transform-data-to-options';

import { projectApi } from './project.api';

import type { BaseQueryListHookProps, QueryOptions } from '@/shared/interface';
import type { GetProject, GetProjectPaginatedResponse, GetUsersProject, ProjectQueries } from './project.interface';
import type { GetTags } from '@/api/endpoints/tags';

const projectKeys = getApiBaseKeys(API_ROUTES.ROOT_PROJECT.absPath);
const projectUserKeys = getApiBaseKeys(API_ROUTES.ROOT_PROJECT_PROJECT_ID_USERS.absPath);
const projectTagsKeys = getApiBaseKeys(API_ROUTES.ROOT_PROJECT_PROJECT_ID_TAGS.absPath);

export const useProjectList = (
  { queries = {} }: BaseQueryListHookProps<ProjectQueries> = {},
  queryOptions?: QueryOptions<GetProjectPaginatedResponse, ReturnType<typeof projectKeys.list>>
) => {
  return useQuery({
    queryKey: projectKeys.list(queries),
    queryFn: ({ signal }) => projectApi.getList(queries, signal),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
};

type QueryHookProps = {
  projectId: GetProject['id'];
};

export const useProject = (
  { projectId }: QueryHookProps,
  queryOptions?: QueryOptions<GetProject, ReturnType<typeof projectKeys.detail>>
) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: ({ signal }) => projectApi.get(projectId, signal),
    ...queryOptions,
  });
};

export const useProjectCreate = () => {
  return useMutation({
    mutationFn: projectApi.create,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.base });
    },
  });
};

export const useUsersProject = (
  { projectId }: QueryHookProps,
  queryOptions?: QueryOptions<GetUsersProject, ReturnType<typeof projectUserKeys.detail>>
) => {
  return useQuery({
    queryKey: projectUserKeys.detail(projectId),
    queryFn: ({ signal }) => projectApi.getUsers(projectId, signal),
    ...queryOptions,
  });
};

export const useTagsProject = (
  { projectId }: QueryHookProps,
  queryOptions?: QueryOptions<GetTags[], ReturnType<typeof projectTagsKeys.detail>>
) => {
  const query = useQuery({
    queryKey: projectTagsKeys.detail(projectId),
    queryFn: ({ signal }) => projectApi.getTags(projectId, signal),
    ...queryOptions,
  });

  const options = transformDataToOptions(query?.data, {
    asIdKey: 'id',
    asValueKey: 'id',
    asLabelKeys: 'title',
  });

  return {
    ...query,
    options,
  };
};

export const useProjectUsersMutate = () => {
  return useMutation({
    mutationFn: projectApi.updateUsers,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectUserKeys.base });
      queryClient.invalidateQueries({ queryKey: projectKeys.base });
    },
  });
};

export const useProjectTagsMutate = () => {
  return useMutation({
    mutationFn: projectApi.updateTags,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectTagsKeys.base });
      queryClient.invalidateQueries({ queryKey: projectKeys.base });
    },
  });
};

export const useProjectInfoMutate = () => {
  return useMutation({
    mutationFn: projectApi.updateInfo,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.base });
    },
  });
};
