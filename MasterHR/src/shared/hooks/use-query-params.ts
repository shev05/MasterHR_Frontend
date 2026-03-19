import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { BaseQueries } from '@/shared/interface';

type TAnyEnum = Record<string, string | number | Date>;

export type TQuerySchema = Record<
  string,
  'Date' | 'string' | ['string'] | 'number' | 'boolean' | TAnyEnum | [TAnyEnum]
>;

export type IQueryParams<SchemaType extends TQuerySchema> = {
  [key in keyof SchemaType]: SchemaType[key] extends 'Date'
    ? Date
    : SchemaType[key] extends 'number'
      ? number
      : SchemaType[key] extends 'string'
        ? string
        : SchemaType[key] extends 'boolean'
          ? boolean
          : SchemaType[key] extends (infer T)[]
            ? T extends TAnyEnum
              ? T[keyof T][]
              : never
            : SchemaType[key] extends infer T
              ? T extends TAnyEnum
                ? T[keyof T]
                : never
              : never;
};

export const getFilterConfig = <T extends BaseQueries, N extends TQuerySchema>(
  params: T,
  defaultValues?: Partial<IQueryParams<N>>
) => {
  const { pageNumber, pageSize, sort_by, sort_direction, ...restParams } = params;

  return Object.entries(restParams).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const defaultValue = defaultValues?.[key];

    let shouldInclude = false;

    if (key === 'status' && Array.isArray(value)) {
      shouldInclude = value.length !== (Array.isArray(defaultValue) ? defaultValue.length : 0);
    } else {
      shouldInclude = defaultValue ? defaultValue !== value : !!value;
    }

    if (shouldInclude) {
      acc[key] = value;
    }

    return acc;
  }, {});
};

interface IHookProps<SchemaType extends TQuerySchema> {
  schema: SchemaType;
  defaultValues?: Partial<IQueryParams<SchemaType>>;
}

export const useQueryParams = <SchemaType extends TQuerySchema>({ schema, defaultValues }: IHookProps<SchemaType>) => {
  const [query, setQuery] = useSearchParams();

  // Parse query params into controlledParams format
  const controlledParams = useMemo(() => {
    return Object.entries(schema).reduce<Record<string, undefined | string | boolean | number | Date>>(
      (resValues, [schemaKey, schemaType]) => {
        const queryValue = query.get(schemaKey) ?? null;
        if (schemaType === 'Date') resValues[schemaKey] = queryValue ?? defaultValues?.[schemaKey] ?? undefined;
        if (schemaType === 'string') resValues[schemaKey] = queryValue ?? defaultValues?.[schemaKey] ?? undefined;
        if (schemaType === 'boolean')
          resValues[schemaKey] = queryValue ?? defaultValues?.[schemaKey]?.toString() ?? undefined;
        if (schemaType === 'number') {
          const queryNumber = queryValue ? parseInt(queryValue, 10) : Number.NaN;
          const resQueryValue = Number.isNaN(queryNumber) ? undefined : queryNumber;
          resValues[schemaKey] = resQueryValue ?? defaultValues?.[schemaKey] ?? undefined;
        }
        if (typeof schemaType === 'object')
          resValues[schemaKey] = queryValue ?? defaultValues?.[schemaKey] ?? undefined;

        return resValues;
      },
      {}
    );
  }, [query, schema, defaultValues]);

  const updateParams = useCallback(
    (params: Partial<IQueryParams<SchemaType>>, options?: Partial<{ withPaginationReset?: boolean }>) => {
      const { withPaginationReset = true } = options || {}; //
      const newQuery = new URLSearchParams(query);

      // Update all existing schema params with current values
      Object.entries(schema).forEach(([paramName]) => {
        const currentValue = controlledParams[paramName];
        const updatedValue = paramName in params ? params[paramName] : currentValue;

        if (updatedValue !== undefined && updatedValue !== null && updatedValue !== '') {
          newQuery.set(paramName, String(updatedValue));
        } else {
          newQuery.delete(paramName);
        }
      });

      // Also handle any additional params that might not be in schema
      Object.entries(params).forEach(([paramName, paramValue]) => {
        if (!(paramName in schema)) {
          if (paramValue !== undefined && paramValue !== null && paramValue !== '') {
            newQuery.set(paramName, String(paramValue));
          } else {
            newQuery.delete(paramName);
          }
        }
      });

      // Check if query actually changed
      let hasChanges = query.size !== newQuery.size;

      if (!hasChanges) {
        for (const [key, value] of newQuery) {
          if (query.get(key) !== value) {
            hasChanges = true;
            break;
          }
        }
      }

      if (hasChanges) {
        if (withPaginationReset) {
          newQuery.set('page', '1');
        }
        setQuery(newQuery, { replace: true });
      }
    },
    [query, schema, controlledParams, setQuery]
  );

  // Calculate dirty filters based on current query params vs default values
  const dirtyFilters = useMemo(() => {
    return getFilterConfig(controlledParams as BaseQueries, defaultValues);
  }, [controlledParams, defaultValues]);

  const appliedFiltersCount = Object.keys(dirtyFilters).length;

  // Clean controlled params (remove undefined/null/empty values)
  const cleanControlledParams = useMemo(() => {
    const cleaned = { ...controlledParams };
    for (const key in cleaned) {
      if (!cleaned[key]) {
        delete cleaned[key];
      }
    }
    return cleaned;
  }, [controlledParams]);

  const resetFilters = useCallback(() => {
    const resetData: Partial<IQueryParams<SchemaType>> = {};

    // Set all dirty filters to undefined to remove them from URL
    for (const key in dirtyFilters) {
      resetData[key as keyof IQueryParams<SchemaType>] = undefined;
    }

    updateParams(resetData);
  }, [dirtyFilters, updateParams]);

  return {
    controlledParams: cleanControlledParams as IQueryParams<SchemaType>,
    updateParams,
    appliedFiltersCount,
    resetFilters,
  };
};
