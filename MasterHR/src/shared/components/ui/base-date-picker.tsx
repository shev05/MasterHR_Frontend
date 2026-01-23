import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverPositioner, PopoverTrigger } from './popover'

export type BaseDatePickerProps = {
  id?: string
  placeholder?: string
  value?: Date
  onValueChange?: (value: Date) => void
}

export function BaseDatePicker({ placeholder = 'Выберите значение', value, onValueChange, id }: BaseDatePickerProps) {
  const [open, setOpen] = useState(false)

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
              id='date'
              data-empty={!value}
              className='w-48 justify-between font-normal'
            >
              {value ? value.toLocaleDateString() : placeholder}
              <ChevronDownIcon />
            </Button>
          }
          id={id}
        />
        <PopoverPositioner align='start'>
          <PopoverContent className='w-auto overflow-hidden p-0'>
            <Calendar
              mode='single'
              selected={value}
              captionLayout='dropdown'
              onSelect={onValueChange}
              required
            />
          </PopoverContent>
        </PopoverPositioner>
      </Popover>
    </div>
  )
}
