import { Link } from 'react-router-dom';

import noFoundImg from '@/assets/images/page-not-found.webp';
import { Button } from '@/shared/components/ui';

export const NotFound = () => {
  return (
    <div className='grid h-screen place-items-center'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <img src={noFoundImg} alt='not found img' className='h-auto w-full max-w-sm' />
        <h2 className='mb-1 mt-3 text-center text-[32px] font-bold'>Ошибка 404</h2>
        <p className='text-center text-lg'>Запрашиваемой страницы нет или она была удалена</p>
        <div className='flex gap-2'>
          <Button render={<Link to='/'>На главную</Link>} variant={'outline'} />
        </div>
      </div>
    </div>
  );
};
