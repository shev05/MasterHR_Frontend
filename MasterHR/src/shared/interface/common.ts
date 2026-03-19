export type BaseDialogProps = {
  closeDialog: () => void;
  isViewMode?: boolean;
};

export type OptionBase = {
  label: string;
  value: number | string;
  id?: number | string;
};

export type RouteHierarchyNode<E> = {
  [key: string]: {
    readonly path: string;
    readonly children?: RouteHierarchyNode<E>;
  } & E;
};

export type InferRouteKeys<T extends RouteHierarchyNode<unknown>, Parent extends string = ''> = {
  [K in keyof T & string]: T[K] extends {
    path: string;
    children: infer Children extends RouteHierarchyNode<unknown>;
  }
    ? `${Parent}${K}` | InferRouteKeys<Children, `${Parent}${K}_`>
    : `${Parent}${K}`;
}[keyof T & string];

export type BaseGetColumnsProps<T = undefined> = Partial<{
  onView: (row: T) => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
}>;

export type QueriesSchemaToType<T> = Partial<{
  [K in keyof T]: T[K] extends 'string'
    ? string
    : T[K] extends 'number'
      ? number
      : T[K] extends 'boolean'
        ? boolean
        : unknown;
}>;

export type BaseQueryListHookProps<T> = {
  queries?: T;
};

export type QuriesParamsType<T> = {
  filters: Partial<T>;
  updateFilters: (params: Partial<T>) => void;
};
