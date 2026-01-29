import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';

import { DEFAULT_QUERIES } from '@/shared/constants';
import { OrderDirection } from '@/shared/interface';
import {
  AppTablePagination,
  CenteredSpinner,
  Checkbox,
  SuspenseWrapper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components';
import { cn } from '@/shared/lib';

import type { ApiPaginatedResponse, BaseQuries } from '@/shared/interface';
import type { ColumnDef, Row, RowSelectionState } from '@tanstack/react-table';

const defaultColumnSizing = {
  size: 150,
  minSize: 10,
  maxSize: Number.MAX_SAFE_INTEGER,
};

const fallbackData: Array<unknown> = [];

export type AppTableProps<T> = {
  data: Undefinable<T[]>;
  meta: Undefinable<Partial<ApiPaginatedResponse<T>['meta']>>;
  isDataFetching?: boolean;
  totalPages?: number;
  totalItems?: number;
  // library type columns /node_modules/@tanstack/table-core/build/lib/core/table.d.ts: ColumnDef<TData, any>[];
  // eslint-disable-next-line
  columns: ColumnDef<T, any>[];

  onSelectionChange?: (args: T[]) => void;
  onPaginationParamsChange?: (args: Pick<BaseQuries, 'page' | 'per_page'>) => void;
  onSortingParamsChange?: (args: Pick<BaseQuries, 'sort_by' | 'sort_direction'>) => void;

  selection?: RowSelectionState | undefined;
  selectionMode?: boolean;
  singleSelection?: boolean;
  sortingMode?: boolean;
  paginationMode?: boolean;
  expandedMode?: boolean;
  getRowId?: ((originalRow: T, index: number, parent?: Row<T> | undefined) => string) | undefined;
};

export const AppTable = <T,>({
  columns,
  data,
  meta,
  isDataFetching,
  getRowId = undefined,

  onPaginationParamsChange,
  onSortingParamsChange,
  onSelectionChange,

  // selection = {},
  singleSelection = false,

  selectionMode = false,
  sortingMode = true,
  paginationMode = true,
}: AppTableProps<T>) => {
  const table = useReactTable({
    data: data ?? (fallbackData as T[]),
    columns,
    defaultColumn: defaultColumnSizing,
    rowCount: meta?.total_elements,
    state: {
      pagination: {
        pageIndex: (meta?.page ?? DEFAULT_QUERIES.page) - 1,
        pageSize: meta?.per_page ?? DEFAULT_QUERIES.per_page,
      },
      // sorting: [{ id: '', desc: true }],
      // rowSelection: selection,
    },

    getRowId,

    getCoreRowModel: getCoreRowModel(),

    //for server side sorting and pagination
    manualPagination: true,
    manualSorting: true,
    enableRowSelection: true,

    onRowSelectionChange: (updater) => {
      const newRowSelection = typeof updater === 'function' ? updater(table.getState().rowSelection) : updater;

      if (singleSelection) {
        const selectedRowIds = Object.keys(newRowSelection);

        if (selectedRowIds.length > 0) {
          const currentSelection = table.getState().rowSelection;
          const newlySelectedRowId = selectedRowIds.find((id) => newRowSelection[id] && !currentSelection[id]);

          if (newlySelectedRowId) {
            const singleRowSelection = { [newlySelectedRowId]: true };
            table.setState((prev) => ({ ...prev, rowSelection: singleRowSelection }));

            const SELECTED_ROW_ENTITIES = table
              .getRowModel()
              .rows.filter((row) => singleRowSelection[row.id])
              .map((row) => row.original);

            onSelectionChange?.(SELECTED_ROW_ENTITIES);
            return;
          }
        }
      }

      table.setState((prev) => ({ ...prev, rowSelection: newRowSelection }));

      const SELECTED_ROW_ENTITIES = table
        .getRowModel()
        .rows.filter((row) => newRowSelection[row.id])
        .map((row) => row.original);

      onSelectionChange?.(SELECTED_ROW_ENTITIES);
    },
    onPaginationChange: (updater) => {
      if (!paginationMode) return;
      const newPagination = typeof updater === 'function' ? updater(table.getState().pagination) : updater;

      onPaginationParamsChange?.({
        page: newPagination.pageIndex + 1,
        per_page: newPagination.pageSize,
      });
    },
    onSortingChange: (updater) => {
      if (!sortingMode) return;
      const newSorting = typeof updater === 'function' ? updater(table.getState().sorting) : updater;

      const currentSort = newSorting[0];
      table.setState((prev) => ({ ...prev, sorting: newSorting }));

      onSortingParamsChange?.({
        sort_by: currentSort?.id,
        sort_direction:
          currentSort?.desc === undefined ? undefined : currentSort?.desc ? OrderDirection.DESC : OrderDirection.ASC,
      });
    },
  });

  const TABLE_ROWS = table.getRowModel().rows;
  const TABLE_HEADER_GROUPS = table.getHeaderGroups();

  return (
    <div className='relative flex h-full flex-col justify-between gap-1 overflow-hidden'>
      {isDataFetching && <CenteredSpinner />}
      <Table wrapperClassName='border rounded-xs h-full justify-between relative '>
        <TableHeader className='bg-table-head sticky top-0 z-10'>
          {TABLE_HEADER_GROUPS.map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                <SuspenseWrapper condition={!!data?.length && selectionMode}>
                  <TableHead key={'checkbox'} colSpan={1} style={{ width: `30px` }}>
                    {singleSelection ? null : (
                      <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        indeterminate={table.getIsSomePageRowsSelected()}
                        onCheckedChange={(_checked, eventDetail) =>
                          table.getToggleAllPageRowsSelectedHandler()(eventDetail.event)
                        }
                      />
                    )}
                  </TableHead>
                </SuspenseWrapper>
                {headerGroup.headers.map((header) => {
                  const isHeaderSorted = header.column.getIsSorted();
                  const headAlign = header.column.columnDef.meta?.style.textAlign;

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: `${header.getSize()}px` }}
                      align={header.column.columnDef.meta?.style.textAlign}
                      className='text-foreground font-medium'
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={(e) => {
                            if (!sortingMode) return;
                            header.column.getToggleSortingHandler()?.(e);
                          }}
                          className={cn(
                            'group/table flex items-center gap-2',
                            sortingMode && header.column.getCanSort() && 'cursor-pointer select-none',
                            headAlign === 'left' && 'justify-start',
                            headAlign === 'right' && 'justify-end',
                            headAlign === 'center' && 'justify-center'
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}

                          <SuspenseWrapper condition={sortingMode && header.column.getCanSort()}>
                            {isHeaderSorted ? (
                              { asc: <ChevronUp size={10} />, desc: <ChevronDown size={10} /> }[
                                isHeaderSorted as string
                              ]
                            ) : (
                              <ChevronsUpDown size={10} className='invisible group-hover/table:visible' />
                            )}
                          </SuspenseWrapper>
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody className='h-full min-h-20'>
          {TABLE_ROWS.length > 0 ? (
            TABLE_ROWS.map((row) => {
              return (
                <TableRow key={row.id}>
                  <SuspenseWrapper condition={selectionMode}>
                    <TableCell key={'checkbox'}>
                      {row.depth === 0 && (
                        <Checkbox
                          checked={row.getIsSelected()}
                          disabled={!row.getCanSelect()}
                          indeterminate={row.getIsSomeSelected()}
                          onCheckedChange={(_checked, eventDetail) => {
                            row.getToggleSelectedHandler()(eventDetail.event);
                          }}
                        />
                      )}
                    </TableCell>
                  </SuspenseWrapper>
                  {row.getVisibleCells().map((cell) => {
                    const cellAlign = cell.column.columnDef.meta?.style.textAlign;

                    return (
                      <TableCell
                        align={cellAlign}
                        key={cell.id}
                        style={{ width: `${cell.column.getSize()}px` }}
                        className={cn(
                          'text-wrap break-all',
                          cellAlign === 'left' && 'justify-start',
                          cellAlign === 'right' && 'justify-end',
                          cellAlign === 'center' && 'justify-center'
                        )}
                      >
                        <span className='line-clamp-5'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow key='empty'>
              <TableCell colSpan={Number.MAX_SAFE_INTEGER} className='text-muted-foreground text-center'>
                Нет данныx
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <SuspenseWrapper condition={!!data?.length && paginationMode}>
        <AppTablePagination meta={meta} table={table} selectionMode={selectionMode} />
      </SuspenseWrapper>
    </div>
  );
};
