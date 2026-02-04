import { Link } from 'react-router-dom';

import noPermImg from '@/assets/images/no-permission.webp';
import { Button } from '@/shared/components/ui';

export const NoPermissions = () => {
  return (
    <div className='grid h-screen place-items-center'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <img src={noPermImg} alt='no perm img' className='h-auto w-full max-w-sm' />
        <p className='text-center text-lg'>У вас нет разрешений просматривать эту страницу</p>
        <div className='gap-m flex'>
          <Button render={<Link to='/'>На главную</Link>} variant={'outline'} />
        </div>
      </div>
    </div>
  );
};
