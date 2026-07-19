import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  userSlice,
  checkUserAuthThunk,
  logoutThunk,
  loginThunk,
  registerThunk,
  editUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  initialState,
} from '@services/slices/user-slice';
import { TOKEN } from '@utils/constants';

import type { fetchWithRefresh, request } from '@utils/api';
import type {
  TAuthServiceResponse,
  TUser,
  TUserResponse,
  TLoginForm,
  TLoginResponse,
} from '@utils/types';
import type { MockedFunction } from 'vitest';

const message = 'Network error';
const TEST_TOKEN = 'sometoken';
const userAuth: TLoginForm = { password: 'password', email: 'email@test.ru' };
const user: TUser = { name: 'user-name', email: 'email@test.ru' };
const successUserResponse: TUserResponse = { success: true, user };
const successAuthResponse: TLoginResponse = {
  success: true,
  user,
  accessToken: TEST_TOKEN,
  refreshToken: TEST_TOKEN,
};
const successServiceResponse: TAuthServiceResponse = {
  success: true,
  message: 'success',
};

vi.mock('@utils/api', () => ({
  request: vi.fn(),
  fetchWithRefresh: vi.fn(),
  defaultRequestOptions: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
}));

const mockStorage = {
  items: new Map<string, string>(),
  getItem: vi.fn((key: string) => mockStorage.items.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => mockStorage.items.set(key, value)),
  removeItem: vi.fn((key: string) => mockStorage.items.delete(key)),
  clear: vi.fn(() => mockStorage.items.clear()),
  length: 0,
  key: vi.fn((i: number) => Array.from(mockStorage.items.keys())[i] ?? null),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockStorage.items.clear();
  mockStorage.length = 0;

  Object.defineProperty(global, 'localStorage', {
    value: mockStorage,
    writable: true,
    configurable: true,
  });
});

describe('user-slice', () => {
  it('тест начального состояния state', () => {
    // 1. Arrange: Готовим входные данные
    const initTestState = undefined;
    const action = { type: '' };

    // 2. Act: Запускаем редьюсер
    const result = userSlice.reducer(initTestState, action);

    // 3. Assert: Проверяем результат
    expect(result).toEqual(initialState);
  });
  it('тест проверки пользователя при наличии токена', async () => {
    mockStorage.items.set(TOKEN.ACCESS, TEST_TOKEN);

    const api = await import('@utils/api');
    (api.fetchWithRefresh as MockedFunction<typeof fetchWithRefresh>).mockResolvedValue(
      successUserResponse
    );

    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(checkUserAuthThunk());

    // Проверяем статус thunk
    expect(result.meta.requestStatus).toBe('fulfilled');

    // Проверяем стейт
    const state = store.getState().user;

    expect(state.user).not.toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
    expect(state.user).toHaveProperty('name');
    expect(state.user).toHaveProperty('email');
  });

  it('тест срабатывания catch при проверки пользователя', async () => {
    mockStorage.items.set(TOKEN.ACCESS, TEST_TOKEN);

    const api = await import('@utils/api');
    (api.fetchWithRefresh as MockedFunction<typeof fetchWithRefresh>).mockRejectedValue(
      new Error(message)
    );

    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(checkUserAuthThunk());

    expect(result.meta.requestStatus).toBe('rejected');
    const state = store.getState().user;

    expect(state.user).toBeNull();
    expect(state.error).toBe(message);
  });

  it('тест проверки пользователя при отсутствии токена', async () => {
    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(checkUserAuthThunk());

    const state = store.getState().user;

    expect(result.meta.requestStatus).toBe('fulfilled');
    expect(state.user).toBeNull();
  });

  it('тест выхода пользователя из аккаунта', async () => {
    mockStorage.items.set(TOKEN.ACCESS, TEST_TOKEN);

    // Проверяем что токен установлен
    expect(mockStorage.getItem(TOKEN.ACCESS)).not.toBeNull();

    const api = await import('@utils/api');
    (api.request as MockedFunction<typeof request>).mockResolvedValue(
      successServiceResponse
    );

    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(logoutThunk());

    // Проверяем статус thunk
    expect(result.meta.requestStatus).toBe('fulfilled');

    // Проверяем стейт и mock ls
    const state = store.getState().user;

    expect(state.user).toBeNull();
    expect(mockStorage.getItem(TOKEN.ACCESS)).toBeNull();
  });

  it('тест успешной авторизации пользователя', async () => {
    // Проверяем что токен не установлен
    expect(mockStorage.getItem(TOKEN.ACCESS)).toBeNull();

    const api = await import('@utils/api');
    (api.request as MockedFunction<typeof request>).mockResolvedValue(
      successAuthResponse
    );

    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(loginThunk(userAuth));

    // Проверяем статус thunk
    expect(result.meta.requestStatus).toBe('fulfilled');

    // Проверяем стейт и mock ls
    const state = store.getState().user;

    expect(state.user).not.toBeNull();
    expect(state.user).toHaveProperty('name');
    expect(state.user).toHaveProperty('email');
    expect(mockStorage.getItem(TOKEN.ACCESS)).toBe(TEST_TOKEN);
  });

  it('тест срабатывания catch при авторизации пользователя', async () => {
    const api = await import('@utils/api');
    (api.request as MockedFunction<typeof request>).mockRejectedValue(
      new Error(message)
    );

    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(loginThunk(userAuth));

    expect(result.meta.requestStatus).toBe('rejected');

    const state = store.getState().user;

    expect(state.user).toBeNull();
    expect(state.error).toBe(message);
  });

  it('тест успешной регистрации пользователя', async () => {
    const api = await import('@utils/api');
    (api.request as MockedFunction<typeof request>).mockResolvedValue(
      successAuthResponse
    );

    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(registerThunk(userAuth));

    expect(result.meta.requestStatus).toBe('fulfilled');

    const state = store.getState().user;

    expect(state.user).not.toBeNull();
    expect(state.user).toHaveProperty('name');
    expect(state.user).toHaveProperty('email');
    expect(mockStorage.getItem(TOKEN.ACCESS)).toBe(TEST_TOKEN);
  });

  it('тест успешного редактирования данных пользователя', async () => {
    mockStorage.items.set(TOKEN.ACCESS, TEST_TOKEN);

    const api = await import('@utils/api');
    (api.fetchWithRefresh as MockedFunction<typeof fetchWithRefresh>).mockResolvedValue(
      successAuthResponse
    );

    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(editUserThunk(userAuth));

    expect(result.meta.requestStatus).toBe('fulfilled');

    const state = store.getState().user;

    expect(state.user).not.toBeNull();
    expect(state.user).toHaveProperty('name');
    expect(state.user).toHaveProperty('email');
  });

  it('тест успешного запроса на смену пароля', async () => {
    const api = await import('@utils/api');
    (api.request as MockedFunction<typeof request>).mockResolvedValue(undefined);

    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(forgotPasswordThunk({ email: 'user@email.ru' }));

    expect(result.meta.requestStatus).toBe('fulfilled');

    const state = store.getState().user;

    expect(state.isLoading).toBeFalsy();
    expect(state.error).toBeNull();
  });

  it('тест успешной смены пароля', async () => {
    const api = await import('@utils/api');
    (api.request as MockedFunction<typeof request>).mockResolvedValue(
      successServiceResponse
    );

    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(
      resetPasswordThunk({ password: 'newpassword', token: 'sometoken' })
    );

    expect(result.meta.requestStatus).toBe('fulfilled');

    const state = store.getState().user;

    expect(state.isLoading).toBeFalsy();
    expect(state.error).toBeNull();
    expect(state.serviceMessage).toBe(successServiceResponse.message);
  });
});
