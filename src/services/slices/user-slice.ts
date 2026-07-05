import { createSlice, createAsyncThunk, type UnknownAction } from '@reduxjs/toolkit';

import { defaultRequestOptions, request } from '@utils/api';
import { URLS } from '@utils/constants';

import type { TLoginForm, TNullable, TUser } from '@utils/types';

type TUserState = {
  user: TNullable<TUser>;
  isLoading: boolean;
  error: TNullable<string>;
};

const initialState: TUserState = {
  user: null,
  isLoading: false,
  error: null,
};

export const getUserDataThunk = createAsyncThunk<TUser>('user/getUserDat', async () => {
  const response: TUser = await request(URLS.GET_USER, {
    ...defaultRequestOptions,
    // body: JSON.stringify({
    // }),
  });

  return response;
});

export const loginThunk = createAsyncThunk<TUser, TLoginForm>(
  'user/login',
  async (data: TLoginForm) => {
    const response: TUser = await request(URLS.LOGIN, {
      ...defaultRequestOptions,
      body: JSON.stringify({
        data,
      }),
    });

    return response;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectUser: (state) => state.user,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state: TUserState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        (action: UnknownAction) => action.type.endsWith('/pending'),
        (state: TUserState) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action: UnknownAction) => action.type.endsWith('/rejected'),
        (state: TUserState, action: { error: { message: string } }) => {
          state.isLoading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { selectIsLoading } = userSlice.selectors;
export default userSlice.reducer;
