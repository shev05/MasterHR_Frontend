import { createColumnHelper } from '@tanstack/react-table';

import { BASE_ACTION_CELL_CONFIG, TableActions } from '@/shared/components/app-table/app-table-actions';

import type { BaseGetColumnsProps } from '@/shared/interface';
import type { GetUserActivator } from '@/api/endpoints/user-activator';

const columnHelper = createColumnHelper<GetUserActivator>();

type GetColumnsProps = BaseGetColumnsProps<GetUserActivator>;

export const getColumns = ({ onAccept }: GetColumnsProps) => [
  columnHelper.accessor('userName', {
    id: 'name',
    cell: ({ row }) => {
      const fullname = [row.original?.userSurname, row.original?.userName, row.original?.userPatronymic].join(' ');
      return <span>{fullname}</span>;
    },
    header: 'ФИО',
    enableSorting: false,
  }),
  columnHelper.accessor('userEmail', {
    id: 'userEmail',
    cell: ({ row }) => <span>{row.original?.userEmail}</span>,
    header: 'Почта',
    enableSorting: false,
  }),
  columnHelper.display({
    ...BASE_ACTION_CELL_CONFIG,
    cell: ({ row }) => <TableActions row={row.original} onAccept={onAccept} />,
  }),
];
