import type { ApiPaginatedResponse, ApiResponse, GetQueries, GetType, WithId } from '@/shared/interface';

//replace object with queries type if need
export type BasePermissionsQueries = Partial<object>;

export type PermissionsQueries = GetQueries<BasePermissionsQueries>;

export type BasePermission = {
  name: string;
  description: string;
  api: string;
};

export type GetPermission = GetType<WithId<BasePermission>>;

export type GetPermissionsPaginatedResponse = ApiPaginatedResponse<GetPermission>;
export type GetPermissionResponse = ApiResponse<GetPermission>;
