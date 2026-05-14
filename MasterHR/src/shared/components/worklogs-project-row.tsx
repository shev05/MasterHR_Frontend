import dayjs from 'dayjs';

import { formatMinutes } from '@/shared/lib';

import type { GetWorklog } from '@/api/endpoints/worklogs';
import type { Dayjs } from 'dayjs';
import type { OptionBase } from '@/shared/interface';

type Props = {
  project: {
    projectId: string;
    logs: GetWorklog[];
  };
  total?: number;
  days: Dayjs[];
  projectOptions: OptionBase[];
  onCellClick?: (worklog?: GetWorklog, date?: Dayjs) => void;
};

export function WorklogsProjectRow({ project, total, days, projectOptions, onCellClick }: Props) {
  const projectOption = projectOptions.find((opt) => opt.value === project.projectId);
  const projectLabel = projectOption?.label || project.projectId;

  const getWorklog = (date: Dayjs) => {
    return project.logs.find((x) => dayjs(x.workDate).isSame(date, 'day'));
  };

  return (
    <div className='grid grid-cols-[repeat(7,1fr)_120px] border-b'>
      {days.map((day) => {
        const worklog = getWorklog(day);
        const minutes = worklog?.spentMinutes || 0;

        if (minutes === 0) {
          return <div key={day.toString()} className='invisible border-r p-2' />;
        }

        return (
          <div
            key={day.toString()}
            className='hover:bg-muted flex cursor-pointer flex-col items-center justify-center border-r p-2 text-sm transition-colors'
            onClick={() => onCellClick?.(worklog, day)}
          >
            <span className='text-muted-foreground max-w-full truncate text-xs'>{projectLabel}</span>
            <span>{formatMinutes(minutes)}</span>
          </div>
        );
      })}

      <div className='flex items-center justify-center font-medium'>
        {total !== undefined ? formatMinutes(total) : ''}
      </div>
    </div>
  );
}
