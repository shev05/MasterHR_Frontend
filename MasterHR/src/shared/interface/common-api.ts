export enum OrderDirection {
  DESC = 'desc',
  ASC = 'asc',
}

export type BaseQueries = Partial<{
  pageNumber: number;
  pageSize: number;
  sort_by: string;
  sort_direction: OrderDirection;
}>;

export type GetQueries<T = undefined> = T & BaseQueries;

export type DBFields = {
  id: string;
  created_at: string;
  updated_at: string;
};

export type GetType<T> = T & DBFields;
export type WithId<T> = T & { id: string };

export type ApiResponse<T = null> = {
  list: T;
  message: string;
};

export type ApiPaginatedResponse<T> = ApiResponse<Array<T>> & {
  meta: Required<BaseQueries> & {
    totalCount: number;
    totalPageCount: number;
  };
};
