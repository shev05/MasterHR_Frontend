import { createColumnHelper } from '@tanstack/react-table';

import { BASE_ACTION_CELL_CONFIG, TableActions } from '@/shared/components/app-table/app-table-actions';

import type { BaseGetColumnsProps } from '@/shared/interface';
import type { GetProject } from '@/api/endpoints/project';

const columnHelper = createColumnHelper<GetProject>();

type GetColumnsProps = BaseGetColumnsProps<GetProject>;

export const getColumns = ({ onView, onDelete }: GetColumnsProps) => [
  columnHelper.accessor('title', {
    id: 'title',
    cell: ({ row }) => <span>{row.original?.title}</span>,
    header: 'Имя',
    enableSorting: false,
  }),
  columnHelper.accessor('description', {
    id: 'description',
    cell: ({ row }) => <span>{row.original?.description}</span>,
    header: 'Описание',
    enableSorting: false,
  }),
  columnHelper.accessor('tags', {
    id: 'tags',
    cell: ({ row }) => {
      const tags = row.original?.tags;
      if (!tags || tags.length === 0) return <span>-</span>;
      return <span>{tags.map((tag) => tag.title).join(', ')}</span>;
    },
    header: 'Теги',
    enableSorting: false,
  }),
  columnHelper.accessor('createdBy.email', {
    id: 'email',
    cell: ({ row }) => <span>{row.original?.createdBy?.email}</span>,
    header: 'Создатель',
    enableSorting: false,
  }),
  columnHelper.display({
    ...BASE_ACTION_CELL_CONFIG,
    cell: ({ row }) => <TableActions row={row.original} onView={onView} onDelete={onDelete} />,
  }),
];
