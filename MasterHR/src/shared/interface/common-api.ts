export enum OrderDirection {
  DESC = 'desc',
  ASC = 'asc',
}

export type BaseQuries = Partial<{
  page: number;
  per_page: number;
  sort_by: string;
  sort_direction: OrderDirection;
}>;

export type GetQueries<T = undefined> = T & BaseQuries;

export type DBFields = {
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type GetType<T> = T & DBFields;
export type WithId<T> = T & { id: string };

export type ApiResponse<T = null> = {
  data: T;
  message: string;
};

export type ApiPaginatedResponse<T> = ApiResponse<Array<T>> & {
  meta: Required<BaseQuries> & {
    total_elements: number;
    total_pages: number;
  };
};
