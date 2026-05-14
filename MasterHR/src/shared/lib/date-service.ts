import { format, formatISO, parse } from 'date-fns';

import type { FormatOptions } from 'date-fns';

export enum DATE_FORMATS {
  short_dotted = 'dd.MM.yyyy',
  short_dashed = 'yyyy-MM-dd',
  time = 'HH:mm',
  short_dotted_with_time = `${short_dotted} ${time}`,
}

export const TIME_VALUES = Array.from({ length: 96 }).map((_, i) => {
  const hour = String(Math.floor(i / 4)).padStart(2, '0');
  const minute = String((i % 4) * 15).padStart(2, '0');
  return `${hour}:${minute}`;
});

export const sFormat = (
  date: string | number | Date,
  formatStr: Undefinable<string> = DATE_FORMATS.short_dotted,
  options?: Undefinable<FormatOptions>
): ReturnType<typeof format> => {
  if (!date) return 'Некорректная дата';
  return format(date, formatStr, options);
};

export const formatDate = (date: Date | null | undefined): string | undefined => {
  // console.log('ISO-DATE-FNS', date && formatISO(date));
  // console.log('ISO-JS', date && date.toISOString());
  return date ? formatISO(date) : undefined;
};

export const parseDate = (dateString: string | null | undefined): Date | undefined => {
  return dateString ? new Date(dateString) : undefined;
};

export const parseDateFromInput = (dateString: string): Date | null => {
  return parse(dateString, DATE_FORMATS.short_dotted, new Date());
};

export const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (!hours) return `${mins}m`;
  if (!mins) return `${hours}h`;

  return `${hours}h ${mins}m`;
};

export const DEFAULT_TIME_SLOTS = [
  '00:00',
  '00:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
  '23:30',
];
