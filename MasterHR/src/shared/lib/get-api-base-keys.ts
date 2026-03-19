export const getApiBaseKeys = <T>(path: string) => ({
  base: [path] as const,
  list: (queries: T) => [...getApiBaseKeys(path).base, 'list', queries] as const,
  detail: (id: string | number) => [...getApiBaseKeys(path).base, 'detail', id] as const,
  detailList: (id: string | number, queries: T) => [...getApiBaseKeys(path).list(queries), 'detail-list', id] as const,
});
