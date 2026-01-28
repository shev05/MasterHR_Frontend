import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { GetUser } from '@/api/endpoints';

interface UserState {
  user: GetUser | null;
  isAuth: boolean;
  setUser: (user: GetUser) => void;
  deleteUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      setUser: (user) =>
        set({
          user,
          isAuth: true,
        }),
      deleteUser: () =>
        set({
          user: null,
          isAuth: false,
        }),
    }),
    {
      name: 'user-storage',
    }
  )
);
export const useCurrUser = () => useUserStore((state) => state.user);
export const useIsAuth = () => useUserStore((state) => state.isAuth);

export const useUserActions = () => {
  const { setUser, deleteUser } = useUserStore();
  return { setUser, deleteUser };
};
