import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { API_ROUTES } from '@/api/api-routes';
import { getApiBaseKeys } from '@/shared/lib';
import { queryClient } from '@/api/query-client';

import { skillsApi } from './skills.api';

import type { BaseSkills, GetSkills, GetSkillsResponse } from './skills.interface';
import type { QueryOptions } from '@/shared/interface';
import type { GetUser } from '@/api/endpoints/user';

const skillsKeys = getApiBaseKeys(API_ROUTES.ROOT_USER_ME_SKILLS.absPath);

type QueryHookProps = {
  userId: GetUser['id'];
};

export const useSkillsList = (
  { userId }: QueryHookProps,
  queryOptions?: QueryOptions<GetSkillsResponse, ReturnType<typeof skillsKeys.detail>>
) => {
  return useQuery({
    queryKey: skillsKeys.detail(userId),
    queryFn: ({ signal }) => skillsApi.getList(userId, signal),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
};
export const useSkillsAdd = () => {
  return useMutation({
    mutationFn: ({ data, userId }: { data: BaseSkills; userId: GetUser['id'] }) => skillsApi.create(data, userId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: skillsKeys.base });
    },
  });
};

export const useSkillsDelete = () => {
  return useMutation({
    mutationFn: ({ skillId, userId }: { skillId: GetSkills['id']; userId: GetUser['id'] }) =>
      skillsApi.delete(skillId, userId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: skillsKeys.base });
    },
  });
};

export const UseExtractSkills = () => {
  return useMutation({
    mutationFn: skillsApi.resumeFile,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: skillsKeys.base });
    },
  });
};
