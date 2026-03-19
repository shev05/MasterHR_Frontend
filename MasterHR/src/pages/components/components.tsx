import { useState } from 'react';

import { Checkbox } from '@/shared/components/controls';

export function ComponentsPage() {
  const [isChecked, setIsChecked] = useState(false);
  // const [comboboxValue, setComboboxValue] = useState<Nullable<OptionBase>>();
  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex flex-row items-center gap-4'>
        <Checkbox label='Пойдешь в группу?' checked={isChecked} onCheckedChange={handleCheckboxChange} />
        {/* <Combobox
          label='Кого выберешь'
          options={comboboxOptions}
          value={comboboxValue}
          onValueChange={setComboboxValue}
          placeholder='Выберите участника'
        /> */}
      </div>
    </div>
  );
}
