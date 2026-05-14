import isoWeek from 'dayjs/plugin/isoWeek';
import dayjs from 'dayjs';

import { Card } from '@/shared/components/ui';
import { useProjectList } from '@/api/endpoints/project';
import { useDialog } from '@/providers';
import { WorklogCreateDialog } from '@/pages/home/ui/create-worklog';
import { formatMinutes } from '@/shared/lib';

import type { GetWorklog } from '@/api/endpoints/worklogs';
import type { Dayjs } from 'dayjs';

dayjs.extend(isoWeek);

type Props = {
  worklogs: GetWorklog[];
  weekDate: Dayjs;
  isPending?: boolean;
};

export function WorklogsWeekTable({ worklogs, weekDate }: Props) {
  const { options: projectOptions } = useProjectList();
  const { showDialog } = useDialog();

  const days = Array.from({ length: 7 }).map((_, index) => weekDate.startOf('isoWeek').add(index, 'day'));

  const groupedByDate = worklogs.reduce(
    (acc, worklog) => {
      const dateKey = worklog.workDate;

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(worklog);

      return acc;
    },
    {} as Record<string, GetWorklog[]>
  );

  const totalMinutes = worklogs.reduce((acc, item) => acc + item.spentMinutes, 0);

  const projectTotals = worklogs.reduce(
    (acc, worklog) => {
      const key = worklog.projectId;
      if (!acc[key]) {
        acc[key] = { projectId: worklog.projectId, total: 0 };
      }
      acc[key].total += worklog.spentMinutes;
      return acc;
    },
    {} as Record<string, { projectId: string; total: number }>
  );

  const handleCardClick = (worklog: GetWorklog) => {
    const projectOption = projectOptions.find((opt) => opt.value === worklog.projectId);

    if (!projectOption) return;

    showDialog({
      getContent: (onClose) => (
        <WorklogCreateDialog
          closeDialog={onClose}
          initialValues={{
            projectId: projectOption,
            workDate: dayjs(worklog.workDate).toDate(),
            spentMinutes: worklog.spentMinutes,
            description: worklog.description || '',
          }}
        />
      ),
    });
  };

  return (
    <Card className='overflow-auto'>
      <div className='min-w-[1000px]'>
        <div className='grid grid-cols-7 border-b'>
          {days.map((day) => (
            <div key={day.toString()} className='border-l p-3 text-center font-medium'>
              <div>{day.format('dd')}</div>
              <div className='text-muted-foreground text-xs'>{day.format('DD.MM')}</div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-7'>
          {days.map((day) => {
            const dateStr = day.format('YYYY-MM-DD');
            const dayLogs = groupedByDate[dateStr] || [];

            return (
              <div key={day.toString()} className='min-h-[80px] space-y-2 border-l p-2'>
                {dayLogs.map((log) => {
                  const projectOption = projectOptions.find((opt) => opt.value === log.projectId);
                  const projectLabel = projectOption?.label || log.projectId;

                  return (
                    <div
                      key={log.id}
                      className='bg-muted hover:bg-accent cursor-pointer rounded-md p-2 text-sm transition-colors'
                      onClick={() => handleCardClick(log)}
                    >
                      <div className='text-muted-foreground truncate text-xs'>{projectLabel}</div>
                      <div className='font-medium'>{formatMinutes(log.spentMinutes)}</div>
                      {log.description && (
                        <div className='text-muted-foreground mt-1 truncate text-xs'>{log.description}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className='space-y-2 border-t p-3'>
          <div className='text-sm font-medium'>Итого за неделю: {formatMinutes(totalMinutes)}</div>
          <div className='space-y-1'>
            {Object.values(projectTotals).map((project) => {
              const projectOption = projectOptions.find((opt) => opt.value === project.projectId);
              const projectLabel = projectOption?.label || project.projectId;

              return (
                <div key={project.projectId} className='flex items-center gap-1 text-sm'>
                  <span className='text-muted-foreground'>{projectLabel}:</span>
                  <span className='font-medium'>{formatMinutes(project.total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
