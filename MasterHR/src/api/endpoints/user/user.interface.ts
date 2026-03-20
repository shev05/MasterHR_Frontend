import type { ApiResponse, GetType } from '@/shared/interface';

export type BaseUser = {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phoneNumber: string;
  position: string;
  role: number;
  avatar: string;
};

export type GetUser = GetType<BaseUser>;

export type GetResponseUser = ApiResponse<GetUser>;
