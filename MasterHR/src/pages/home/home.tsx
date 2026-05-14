import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useState } from 'react';

import { useWorklogList } from '@/api/endpoints/worklogs';
import { AppPageHeader } from '@/shared/components/app-page-header';
import { AddButton, Button } from '@/shared/components/ui';
import { WorklogsWeekTable } from '@/shared/components/worklogs-week-table';
import { useDialog } from '@/providers';

import { WorklogCreateDialog } from './ui/create-worklog';

dayjs.extend(isoWeek);

export function HomePage() {
  const [currentWeek, setCurrentWeek] = useState(dayjs());

  const startDate = currentWeek.startOf('isoWeek').format('YYYY-MM-DD');
  const endDate = currentWeek.endOf('isoWeek').format('YYYY-MM-DD');

  const { data, isPending } = useWorklogList({
    queries: {
      StartDate: startDate,
      EndDate: endDate,
    },
  });

  const { showDialog } = useDialog();

  const handleWoklogMutate = () => {
    showDialog({
      getContent: (onClose) => <WorklogCreateDialog closeDialog={onClose} />,
    });
  };

  return (
    <>
      <AppPageHeader title='Трекинг времени'>
        <div className='flex items-center gap-2'>
          <AddButton onClick={() => handleWoklogMutate()}>Записать время</AddButton>
          <Button variant='outline' onClick={() => setCurrentWeek((prev) => prev.subtract(1, 'week'))}>
            Предыдущая
          </Button>
          <Button variant='outline' onClick={() => setCurrentWeek(dayjs())}>
            Текущая
          </Button>
          <Button variant='outline' onClick={() => setCurrentWeek((prev) => prev.add(1, 'week'))}>
            Следующая
          </Button>
        </div>
      </AppPageHeader>

      <WorklogsWeekTable worklogs={data || []} weekDate={currentWeek} isPending={isPending} />
    </>
  );
}
