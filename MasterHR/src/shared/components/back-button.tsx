import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/shared/components/ui';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <Button variant='ghost' size='sm' onClick={() => navigate(-1)}>
      <ArrowLeft className='mr-2 h-4 w-4' />
      Назад
    </Button>
  );
}
