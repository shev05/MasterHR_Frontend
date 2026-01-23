import { createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import type { GetUser } from '@/api/endpoints';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

export interface IUserSlice {
  user: GetUser | null;
}

export const initialState: IUserSlice = {
  user: null,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<GetUser>) => {
      state.user = action.payload;
    },
    deleteUser: (state) => {
      state.user = null;
    },
  },
});

const selfSelector = (state: RootState) => state.currUser;

export const currUserSelector = createDraftSafeSelector(selfSelector, (state) => state.user);

export const userActions = {
  ...userSlice.actions,
};

const persistConfig = {
  key: 'user',
  storage,
};

export const userReducer = persistReducer(persistConfig, userSlice.reducer);
