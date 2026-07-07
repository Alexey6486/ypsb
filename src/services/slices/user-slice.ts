import {
  createSlice,
  createAsyncThunk,
  type UnknownAction,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { defaultRequestOptions, fetchWithRefresh, request } from '@utils/api';
import { TOKEN, URLS } from '@utils/constants';

import type {
  TForgotPasswordForm,
  TResetPasswordForm,
  TLoginForm,
  TNullable,
  TUser,
  TLoginResponse,
  TUserResponse,
  TAuthServiceResponse,
  TRegisterForm,
} from '@utils/types';

type TUserState = {
  user: TNullable<TUser>;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: TNullable<string>;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const checkUserAuthThunk = createAsyncThunk<TUser | null>(
  'user/checkUserAuth',
  async (_, thunkApi) => {
    try {
      const token = localStorage.getItem(TOKEN.ACCESS);

      if (token) {
        const response: TUserResponse = await fetchWithRefresh(URLS.GET_USER, {
          ...defaultRequestOptions,
          method: 'GET',
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
          ...data,
        }),
      });

      localStorage.setItem(TOKEN.ACCESS, response.accessToken);
      localStorage.setItem(TOKEN.REFRESH, response.refreshToken);

      return response.user;
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(error?.message ?? 'Не удалось авторизоваться.');
    }
  }
);

export const registerThunk = createAsyncThunk<TUser, TLoginForm>(
  'user/register',
  async (data: TLoginForm, thunkApi) => {
    try {
      const response: TLoginResponse = await request(URLS.REGISTER, {
        ...defaultRequestOptions,
        body: JSON.stringify({
          ...data,
        }),
      });

      localStorage.setItem(TOKEN.ACCESS, response.accessToken);
      localStorage.setItem(TOKEN.REFRESH, response.refreshToken);

      return response.user;
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(
        error?.message ?? 'Не удалось зарегистрироваться.'
      );
    }
  }
);

export const logoutThunk = createAsyncThunk<TAuthServiceResponse>(
  'user/logout',
  async (_, thunkApi) => {
    try {
      const token = localStorage.getItem(TOKEN.REFRESH);
      const response: TAuthServiceResponse = await request(URLS.LOGOUT, {
        ...defaultRequestOptions,
        body: JSON.stringify({
          token,
        }),
      });

      localStorage.removeItem(TOKEN.ACCESS);
      localStorage.removeItem(TOKEN.REFRESH);

      return response;
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(error?.message ?? 'Не удалось выйти из профиля.');
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk<
  TAuthServiceResponse,
  TForgotPasswordForm
>('user/forgotPassword', async (data: TForgotPasswordForm, thunkApi) => {
  try {
    await request(URLS.FORGOT_PSW, {
      ...defaultRequestOptions,
      body: JSON.stringify({
        ...data,
      }),
    });
  } catch (error: unknown) {
    return thunkApi.rejectWithValue(
      error?.message ?? 'Не удалось запросить сброс пароля.'
    );
  }
});

export const resetPasswordThunk = createAsyncThunk<
  TAuthServiceResponse,
  TResetPasswordForm
>('user/resetPassword', async (data: TResetPasswordForm, thunkApi) => {
  try {
    const response: TAuthServiceResponse = await request(URLS.RESET_PSW, {
      ...defaultRequestOptions,
      body: JSON.stringify({
        ...data,
      }),
    });

    return response.message;
  } catch (error: unknown) {
    return thunkApi.rejectWithValue(error?.message ?? 'Не удалось сбросить пароль.');
  }
});

export const editUserThunk = createAsyncThunk<TUser, TRegisterForm>(
  'user/editUser',
  async (data: TLoginForm, thunkApi) => {
    try {
      const token = localStorage.getItem(TOKEN.ACCESS);

      if (token) {
        const response: TUserResponse = await fetchWithRefresh(URLS.GET_USER, {
          ...defaultRequestOptions,
          headers: {
            ...defaultRequestOptions.headers,
            Authorization: token,
          },
          method: 'PATCH',
          body: JSON.stringify({
            ...data,
          }),
        });

        return response.user;
      }

      return null;
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(
        error?.message ?? 'Не удалось изменить данные пользователя.'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, { payload }: PayloadAction<boolean>) => {
      state.isAuthChecked = payload;
    },
    setUser: (state, { payload }: PayloadAction<TUser>) => {
      state.user = payload;
    },
  },
  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectError: (state) => state.error,
    selectUser: (state) => state.user,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state: TUserState, { payload }) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = payload;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state: TUserState, { payload }) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = payload;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state: TUserState) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
        state.error = null;
      })
      .addCase(checkUserAuthThunk.fulfilled, (state: TUserState, { payload }) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = payload;
        state.error = null;
      })
      .addCase(
        checkUserAuthThunk.rejected,
        (
          state: TUserState,
          { payload }: PayloadAction<{ error: { message: string } }>
        ) => {
          state.isLoading = false;
          state.isAuthChecked = true;
          state.error = payload?.error?.message ?? '';
        }
      )
      .addCase(forgotPasswordThunk.fulfilled, (state: TUserState) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state: TUserState) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editUserThunk.fulfilled, (state: TUserState, { payload }) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = payload;
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
          state.error = action?.error?.message ?? '';
        }
      );
  },
});

export const { setIsAuthChecked, setUser } = userSlice.actions;
export const { selectIsLoading, selectIsAuthChecked, selectUser } = userSlice.selectors;
export default userSlice.reducer;
