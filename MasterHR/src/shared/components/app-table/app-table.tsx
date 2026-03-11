import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';

import { SuspenseWrapper, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui';
import { DEFAULT_QUERIES } from '@/shared/constants/base-query-params';
import { cn } from '@/shared/lib/cn';
import { Checkbox } from '@/shared/components/controls';
import { CenteredSpinner } from '@/shared/components/centered-spinner';
import { OrderDirection } from '@/shared/interface';

import { AppTablePagination } from './app-table-pagination';

import type { ColumnDef, Row, RowSelectionState } from '@tanstack/react-table';
import type { ApiPaginatedResponse, BaseQueries } from '@/shared/interface';

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
  isDataPending?: boolean;
  totalPages?: number;
  totalItems?: number;
  perPage?: number;
  // library type columns /node_modules/@tanstack/table-core/build/lib/core/table.d.ts: ColumnDef<TData, any>[];
  // eslint-disable-next-line
  columns: ColumnDef<T, any>[];

  onSelectionChange?: (args: T[]) => void;
  onPaginationParamsChange?: (args: Pick<BaseQueries, 'page' | 'per_page'>) => void;
  onSortingParamsChange?: (args: Pick<BaseQueries, 'sort_by' | 'sort_direction'>) => void;

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
  isDataPending,
  perPage,
  getRowId = undefined,

  onPaginationParamsChange,
  onSortingParamsChange,
  onSelectionChange,

  selection = {},
  singleSelection = true,

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
      rowSelection: selection,
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
      <Table wrapperClassName='border rounded-md h-full justify-between relative '>
        <SuspenseWrapper condition={isDataFetching} fallback={<CenteredSpinner />}>
          <TableHeader className='bg-table-head sticky top-0 z-10'>
            {TABLE_HEADER_GROUPS.map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  <SuspenseWrapper condition={selectionMode}>
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
                        className={cn('text-foreground font-medium', isDataPending && 'pointer-events-none blur')}
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
                                {
                                  asc: <ChevronUp size={10} className='text-primary' />,
                                  desc: <ChevronDown size={10} className='text-primary' />,
                                }[isHeaderSorted as string]
                              ) : (
                                <ChevronsUpDown
                                  size={10}
                                  className='text-primary invisible group-hover/table:visible'
                                />
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
          <TableBody>
            {TABLE_ROWS.length > 0 ? (
              TABLE_ROWS.map((row) => {
                return (
                  <TableRow key={row.id}>
                    <SuspenseWrapper condition={selectionMode}>
                      <TableCell key={'checbox'}>
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
                            'whitespace-normal text-wrap break-words',
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
              <TableRow
                key='empty'
                className='bg-background hover:bg-background absolute inset-0 flex h-full w-full items-center justify-center'
              >
                <TableCell className='text-center'>Нет данныx</TableCell>
              </TableRow>
            )}
          </TableBody>
        </SuspenseWrapper>
      </Table>
      <SuspenseWrapper condition={paginationMode || !!data?.length}>
        <AppTablePagination meta={meta} table={table} selectionMode={selectionMode} perPage={perPage} />
      </SuspenseWrapper>
    </div>
  );
};
