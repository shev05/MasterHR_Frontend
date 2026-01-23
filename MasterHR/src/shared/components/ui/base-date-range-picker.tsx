import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

import { DATE_FORMATS, sFormat } from '@/shared/lib'

import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverPositioner, PopoverTrigger } from './popover'

import type { DateRange, OnSelectHandler } from 'react-day-picker'

export type BaseDateRangePickerProps = {
  id?: string
  placeholder?: string
  value?: DateRange
  onValueChange?: OnSelectHandler<DateRange> | undefined
}

export function BaseDateRangePicker({ placeholder = 'Выберите значение', value, onValueChange, id }: BaseDateRangePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className='flex flex-col gap-3'>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger
          id={id}
          render={
            <Button
              variant='outline'
              data-empty={!value}
              className='text-muted-foreground dark:bg-input/30 w-full min-w-80 justify-start text-left font-normal'
            >
              <CalendarIcon className='h-4 w-4 opacity-50' />
              {value?.from ? sFormat(value.from, DATE_FORMATS.short) : <span>{placeholder}</span>}
              {value?.to ? `-${sFormat(value.to, DATE_FORMATS.short)}` : ''}
            </Button>
          }
        />
        <PopoverPositioner align='start'>
          <PopoverContent className='w-auto overflow-hidden p-0'>
            <Calendar
              mode='range'
              selected={value}
              onSelect={onValueChange}
              captionLayout='dropdown'
              numberOfMonths={2}
              required
            />
          </PopoverContent>
        </PopoverPositioner>
      </Popover>
    </div>
  )
}
