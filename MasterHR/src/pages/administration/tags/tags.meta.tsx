import { createColumnHelper } from '@tanstack/react-table';

import { BASE_ACTION_CELL_CONFIG, TableActions } from '@/shared/components/app-table/app-table-actions';

import type { GetTags } from '@/api/endpoints/tags';
import type { BaseGetColumnsProps } from '@/shared/interface';

const columnHelper = createColumnHelper<GetTags>();

type GetColumnsProps = BaseGetColumnsProps<GetTags>;

export const getColumns = ({ ...actions }: GetColumnsProps) => [
  columnHelper.accessor('title', {
    id: 'title',
    cell: ({ row }) => <span>{row.original?.title}</span>,
    header: 'Имя',
    enableSorting: false,
  }),
  columnHelper.display({
    ...BASE_ACTION_CELL_CONFIG,
    cell: ({ row }) => {
      return <TableActions row={row.original} {...actions} />;
    },
  }),
];
