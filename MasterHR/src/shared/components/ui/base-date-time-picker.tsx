import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { DEFAULT_TIME_SLOTS } from '@/shared/lib'

import { Popover, PopoverContent, PopoverPositioner, PopoverTrigger } from './popover'
import { Button } from './button'
import { Calendar } from './calendar'

export type BaseDateTimePickerProps = {
  id?: string
  placeholder?: string
  value?: Date
  onValueChange?: (value: Date) => void
  timeSlots?: string[]
}

export function BaseDateTimePicker({
  placeholder = 'Выберите значение',
  value,
  onValueChange,
  id,
  timeSlots = DEFAULT_TIME_SLOTS,
}: BaseDateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<Date | undefined>(value)

  const formatDisplayValue = (date?: Date) => {
    if (!date) return ''
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    const newDate = new Date(selectedDate)
    if (internalValue) {
      newDate.setHours(internalValue.getHours())
      newDate.setMinutes(internalValue.getMinutes())
    } else {
      newDate.setHours(0, 0, 0, 0)
    }

    setInternalValue(newDate)
    onValueChange?.(newDate)
  }

  const handleTimeChange = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const baseDate = internalValue || new Date()
    const newDate = new Date(baseDate)
    newDate.setHours(hours, minutes, 0, 0)

    setInternalValue(newDate)
    onValueChange?.(newDate)
  }

  return (
    <div className='flex flex-col gap-3'>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger
          render={
            <Button
              variant='outline'
              id={id}
              data-empty={!internalValue}
              className='w-64 justify-between font-normal'
            >
              {internalValue ? formatDisplayValue(internalValue) : placeholder}
              <ChevronDownIcon />
            </Button>
          }
        />
        <PopoverPositioner align='start'>
          <PopoverContent className='flex max-h-96 w-auto flex-col p-0'>
            <div className='flex'>
              <div className='border-r'>
                <Calendar
                  mode='single'
                  selected={internalValue}
                  captionLayout='dropdown'
                  onSelect={handleDateSelect}
                  required
                />
              </div>

              <div className='h-80 w-32 overflow-y-auto'>
                <div className='p-2'>
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      onClick={() => handleTimeChange(time)}
                      className={`w-full justify-center mb-1${
                        internalValue &&
                        time === `${internalValue.getHours().toString().padStart(2, '0')}:${internalValue.getMinutes().toString().padStart(2, '0')}`
                          ? ''
                          : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </PopoverPositioner>
      </Popover>
    </div>
  )
}
