import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button, SuspenseWrapper } from '@/shared/components/ui';
import { TABLE_PER_PAGE_OPTIONS } from '@/shared/constants';
import { Select } from '@/shared/components/controls';

import type { ApiPaginatedResponse } from '@/shared/interface';
import type { Table } from '@tanstack/react-table';

type AppTablePaginationProps<T> = {
  table: Table<T>;
  meta: Undefinable<Partial<ApiPaginatedResponse<T>['meta']>>;
  selectionMode?: boolean;
  perPage?: number;
};

export const AppTablePagination = <T,>({ table, meta, selectionMode, perPage }: AppTablePaginationProps<T>) => {
  const { totalCount, totalPageCount, pageNumber } = meta || {};
  return (
    <div className='flex items-center justify-between gap-2 text-nowrap text-xs'>
      <SuspenseWrapper condition={!!selectionMode}>
        {Object.keys(table.getSelectedRowModel().rows || {}).length} из {table.getPreFilteredRowModel().rows.length}
        выбрано
      </SuspenseWrapper>
      <div className='items_center flex w-full justify-end gap-4'>
        <SuspenseWrapper condition={!!totalCount}>
          <div className='flex items-center gap-2'>
            <Select
              fieldOrientation='horizontal'
              label='Строк на странице'
              value={perPage || table.getState()?.pagination?.pageSize?.toString()}
              onValueChange={(value) => {
                table.setPagination({
                  pageIndex: 0,
                  pageSize: Number(value),
                });
                table.resetRowSelection();
              }}
              options={TABLE_PER_PAGE_OPTIONS}
            />
            из {totalCount}
          </div>
        </SuspenseWrapper>
        <SuspenseWrapper condition={!!totalPageCount}>
          <p className='inline-flex items-center gap-2'>
            <span>Страница:</span>
            <span>
              {pageNumber} из {totalPageCount}
            </span>
          </p>
          <div className='flex gap-1.5'>
            <Button
              variant={'outline'}
              size={'icon-sm'}
              onClick={() => {
                table.firstPage();
                table.resetRowSelection();
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant={'outline'}
              size={'icon-sm'}
              onClick={() => {
                table.previousPage();
                table.resetRowSelection();
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant={'outline'}
              size={'icon-sm'}
              onClick={() => {
                table.nextPage();
                table.resetRowSelection();
              }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              variant={'outline'}
              size={'icon-sm'}
              onClick={() => {
                table.lastPage();
                table.resetRowSelection();
              }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
        </SuspenseWrapper>
      </div>
    </div>
  );
};
