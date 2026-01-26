import { useNavigate } from 'react-router-dom';

import errorImg from '@/assets/images/error.webp';
import { Button } from '@/shared/components/ui';

import type { FC } from 'react';

type ErrorProps = {
  errorMessage?: string;
  onRetry?: () => void;
};

export const Error: FC<ErrorProps> = ({ errorMessage = '', onRetry }) => {
  const navigate = useNavigate();

  const handleToPrevPage = () => {
    navigate(-1);
    if (onRetry != null) onRetry();
  };
  const handleToHome = async () => {
    navigate('/', { replace: true });
    await new Promise((resolve) => setTimeout(resolve, 50));
    if (onRetry != null) onRetry();
  };

  return (
    <div className='grid h-screen place-items-center'>
      <div className='gap-s flex flex-col items-center justify-center'>
        <img src={errorImg} alt='error img' className='h-auto w-full max-w-sm' />
        <p className='text-error text-lg font-bold'>Что-то пошло не так. Ошибка:</p>
        <p className='w-125 text-wrap text-center'>{errorMessage}</p>
        <div className='flex gap-2'>
          <Button variant={'outline'} onClick={handleToPrevPage}>
            Назад
          </Button>
          <Button variant={'outline'} onClick={handleToHome}>
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
};
