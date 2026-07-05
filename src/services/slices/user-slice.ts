import { createSlice, createAsyncThunk, type UnknownAction } from '@reduxjs/toolkit';

import { defaultRequestOptions, fetchWithRefresh, request } from '@utils/api';
import { URLS } from '@utils/constants';

import type {
  TLoginForm,
  TNullable,
  TUser,
  TLoginResponse,
  TUserResponse,
} from '@utils/types';

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

export const getUserDataThunk = createAsyncThunk<TUser | null>(
  'user/getUserDat',
  async (_, thunkApi) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (token) {
        const response: TUserResponse = await fetchWithRefresh(URLS.GET_USER, {
          ...defaultRequestOptions,
          headers: {
            ...defaultRequestOptions.headers,
            Authorization: token,
          },
        });

        return response.user;
      }

      return null;
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(
        error?.message ?? 'Не удалось получить данные пользователя.'
      );
    }
  }
);

export const loginThunk = createAsyncThunk<TUser, TLoginForm>(
  'user/login',
  async (data: TLoginForm, thunkApi) => {
    try {
      const response: TLoginResponse = await request(URLS.LOGIN, {
        ...defaultRequestOptions,
        body: JSON.stringify({
          data,
        }),
      });

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response.user;
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(error?.message ?? 'Не удалось авторизоваться.');
    }
  }
);

export const registerThunk = createAsyncThunk<TLoginResponse, TLoginForm>(
  'user/register',
  async (data: TLoginForm, thunkApi) => {
    try {
      const response: TLoginResponse = await request(URLS.REGISTER, {
        ...defaultRequestOptions,
        body: JSON.stringify({
          data,
        }),
      });

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response.user;
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(
        error?.message ?? 'Не удалось зарегистрироваться.'
      );
    }
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
      .addCase(loginThunk.fulfilled, (state: TUserState, { payload }) => {
        state.isLoading = false;
        state.user = payload;
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
