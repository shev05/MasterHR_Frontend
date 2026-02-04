import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button, Select, SuspenseWrapper } from '@/shared/components';
import { TABLE_PER_PAGE_OPTIONS } from '@/shared/constants';

import type { ApiPaginatedResponse } from '@/shared/interface';
import type { Table } from '@tanstack/react-table';

type AppTablePaginationProps<T> = {
  table: Table<T>;
  meta: Undefinable<Partial<ApiPaginatedResponse<T>['meta']>>;
  selectionMode?: boolean;
};

export const AppTablePagination = <T,>({ table, meta, selectionMode }: AppTablePaginationProps<T>) => {
  const { total_elements, total_pages, page } = meta || {};
  return (
    <div className='flex items-center justify-between gap-2 text-nowrap text-xs'>
      <SuspenseWrapper condition={!!selectionMode}>
        {Object.keys(table.getSelectedRowModel().rows || {}).length} из {table.getPreFilteredRowModel().rows.length}
        выбрано
      </SuspenseWrapper>
      <div className='items_center flex w-full justify-end gap-4'>
        <SuspenseWrapper condition={!!total_elements}>
          <div className='flex items-center gap-2'>
            <Select
              fieldOrientation='horizontal'
              label='Строк на странице'
              value={table.getState()?.pagination?.pageSize?.toString()}
              onValueChange={(value) => {
                table.setPagination({
                  pageIndex: 0,
                  pageSize: Number(value),
                });
                table.resetRowSelection();
              }}
              options={TABLE_PER_PAGE_OPTIONS}
            />
            из {total_elements}
          </div>
        </SuspenseWrapper>
        <SuspenseWrapper condition={!!total_pages}>
          <p className='inline-flex items-center gap-2'>
            <span>Страница:</span>
            <span>
              {page} из {total_pages}
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
