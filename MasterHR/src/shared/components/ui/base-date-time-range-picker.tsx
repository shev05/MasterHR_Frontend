import { useState } from 'react';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';

import { DEFAULT_TIME_SLOTS, DATE_FORMATS, sFormat } from '@/shared/lib';

import { Popover, PopoverContent, PopoverPositioner, PopoverTrigger } from './popover';
import { Button } from './button';
import { Calendar } from './calendar';

import type { DateRange, OnSelectHandler } from 'react-day-picker';

export type BaseDateTimeRangePickerProps = {
  id?: string;
  placeholder?: string;
  value?: DateRange;
  onValueChange?: (value: DateRange) => void;
  timeSlots?: string[];
};

export function BaseDateTimeRangePicker({
  placeholder = 'Выберите период',
  value,
  onValueChange,
  id,
  timeSlots = DEFAULT_TIME_SLOTS,
}: BaseDateTimeRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<DateRange | undefined>(value);

  const formatDisplayValue = () => {
    if (!internalValue?.from) return '';

    const fromDate = internalValue.from;
    const toDate = internalValue.to;

    const fromString = sFormat(fromDate, DATE_FORMATS.short);
    const fromTime = `${fromDate.getHours().toString().padStart(2, '0')}:${fromDate.getMinutes().toString().padStart(2, '0')}`;
    const fromDateTime = `${fromString} ${fromTime}`;

    if (!toDate) {
      return fromDateTime;
    }

    const toString = sFormat(toDate, DATE_FORMATS.short);
    const toTime = `${toDate.getHours().toString().padStart(2, '0')}:${toDate.getMinutes().toString().padStart(2, '0')}`;
    const toDateTime = `${toString} ${toTime}`;

    return `${fromDateTime} - ${toDateTime}`;
  };

  const handleDateSelect: OnSelectHandler<DateRange> = (selectedRange) => {
    if (!selectedRange) return;

    const newFrom = selectedRange.from ? new Date(selectedRange.from) : undefined;
    const newTo = selectedRange.to ? new Date(selectedRange.to) : undefined;

    if (newFrom && internalValue?.from) {
      newFrom.setHours(internalValue.from.getHours());
      newFrom.setMinutes(internalValue.from.getMinutes());
    } else if (newFrom) {
      newFrom.setHours(0, 0, 0, 0);
    }

    if (newTo && internalValue?.to) {
      newTo.setHours(internalValue.to.getHours());
      newTo.setMinutes(internalValue.to.getMinutes());
    } else if (newTo) {
      newTo.setHours(0, 0, 0, 0);
    }

    const newValue: DateRange = {
      from: newFrom,
      to: newTo,
    };

    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const handleFromTimeChange = (time: string) => {
    if (!internalValue?.from) return;

    const [hours, minutes] = time.split(':').map(Number);
    const newFrom = new Date(internalValue.from);
    newFrom.setHours(hours, minutes, 0, 0);

    const newValue: DateRange = {
      ...internalValue,
      from: newFrom,
    };

    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const handleToTimeChange = (time: string) => {
    if (!internalValue?.to) return;

    const [hours, minutes] = time.split(':').map(Number);
    const newTo = new Date(internalValue.to);
    newTo.setHours(hours, minutes, 0, 0);

    const newValue: DateRange = {
      ...internalValue,
      to: newTo,
    };

    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const formatTimeForDisplay = (date?: Date) => {
    if (!date) return '';
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className='flex flex-col gap-3'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant='outline'
              id={id}
              data-empty={!internalValue?.from}
              className='min-w-80 justify-between font-normal'
            >
              <div className='flex items-center gap-2'>
                <CalendarIcon className='h-4 w-4 opacity-50' />
                {internalValue?.from ? formatDisplayValue() : <span>{placeholder}</span>}
              </div>
              <ChevronDownIcon />
            </Button>
          }
        />
        <PopoverPositioner align='start'>
          <PopoverContent className='flex max-h-96 w-auto flex-col p-0'>
            <div className='flex'>
              <div className='border-r'>
                <Calendar
                  mode='range'
                  selected={internalValue}
                  onSelect={handleDateSelect}
                  captionLayout='dropdown'
                  numberOfMonths={2}
                  required
                />
              </div>

              {internalValue?.from && (
                <div className='h-80 w-32 overflow-y-auto border-r'>
                  <div className='p-2'>
                    <div className='bg-background sticky top-0 z-10 mb-2 border-b pb-1 text-center text-sm font-medium'>
                      С
                    </div>
                    {timeSlots.map((time) => (
                      <Button
                        key={`from-${time}`}
                        onClick={() => handleFromTimeChange(time)}
                        className={`mb-1 w-full justify-center text-xs ${
                          formatTimeForDisplay(internalValue.from) === time ? '' : 'bg-accent text-accent-foreground'
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {internalValue?.to && (
                <div className='h-80 w-32 overflow-y-auto'>
                  <div className='p-2'>
                    <div className='bg-background sticky top-0 z-10 mb-2 border-b pb-1 text-center text-sm font-medium'>
                      По
                    </div>
                    {timeSlots.map((time) => (
                      <Button
                        key={`to-${time}`}
                        onClick={() => handleToTimeChange(time)}
                        className={`mb-1 w-full justify-center text-xs ${
                          formatTimeForDisplay(internalValue.to) === time ? '' : 'bg-accent text-accent-foreground'
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </PopoverPositioner>
      </Popover>
    </div>
  );
}
