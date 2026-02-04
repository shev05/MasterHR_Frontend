import type { GetType, WithId } from '@/shared/interface';

export type BaseUser = {
  email: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  role_id: string;
};

export type GetUser = GetType<WithId<BaseUser>>;
