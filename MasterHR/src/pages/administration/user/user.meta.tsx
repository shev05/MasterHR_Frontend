import { createColumnHelper } from '@tanstack/react-table';

import { roleUser } from '@/shared/constants/role-user';
import { BASE_ACTION_CELL_CONFIG, TableActions } from '@/shared/components/app-table/app-table-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui';
import { API_BASE_URL } from '@/api/http-client';

import type { GetUser } from '@/api/endpoints/user';
import type { BaseGetColumnsProps } from '@/shared/interface';

const columnHelper = createColumnHelper<GetUser>();

type GetColumnsProps = BaseGetColumnsProps<GetUser>;

export const getColumns = ({ onView, onDelete }: GetColumnsProps) => [
  columnHelper.accessor('avatar', {
    id: 'avatar',
    cell: ({ row }) => {
      return (
        <Avatar className='h-7 w-7'>
          <AvatarImage src={`${API_BASE_URL}${row.original?.avatar}`} />
          <AvatarFallback>
            {row.original?.name?.charAt(0).toUpperCase()}
            {row.original?.surname?.charAt(0).toUpperCase()}
            {row.original?.patronymic?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    },
    header: '',
    size: 10,
    minSize: 10,
    maxSize: 10,
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    id: 'name',
    cell: ({ row }) => {
      const fullname = [row.original?.name, row.original?.surname, row.original?.patronymic].join(' ');
      return <span>{fullname}</span>;
    },
    header: 'ФИО',
    enableSorting: false,
  }),
  columnHelper.accessor('email', {
    id: 'email',
    cell: ({ row }) => <span>{row.original?.email}</span>,
    header: 'Почта',
    enableSorting: false,
  }),
  columnHelper.accessor('phoneNumber', {
    id: 'phoneNumber',
    cell: ({ row }) => <span>{row.original?.phoneNumber}</span>,
    header: 'Теги',
    enableSorting: false,
  }),
  columnHelper.accessor('position', {
    id: 'position',
    cell: ({ row }) => <span>{row.original?.position}</span>,
    header: 'Должность',
    enableSorting: false,
  }),
  columnHelper.accessor('role', {
    id: 'role',
    cell: ({ row }) => <span>{roleUser[row.original?.role]}</span>,
    header: 'Роль',
    enableSorting: false,
  }),
  columnHelper.display({
    ...BASE_ACTION_CELL_CONFIG,
    cell: ({ row }) => <TableActions row={row.original} onView={onView} onDelete={onDelete} />,
  }),
];
