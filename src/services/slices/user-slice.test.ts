import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { userSlice, checkUserAuthThunk } from '@services/slices/user-slice';
import { TOKEN } from '@utils/constants';

import type { fetchWithRefresh } from '@utils/api';
import type { TUser, TUserResponse } from '@utils/types';
import type { MockedFunction } from 'vitest';

// const initState: TUserState = {
//   user: null,
//   isAuthChecked: false,
//   isLoading: false,
//   error: null,
// };

// const action = {
//   type: 'user/',
//   payload: {},
// } as PayloadAction<object>;

const user: TUser = { name: 'user-name', email: 'email@test.ru' };
const successResponse: TUserResponse = { success: true, user };

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
  it('loginThunk updates store on fulfilled', async () => {
    mockStorage.items.set(TOKEN.ACCESS, 'my-token');

    const api = await import('@utils/api');
    (api.fetchWithRefresh as MockedFunction<typeof fetchWithRefresh>).mockResolvedValue(
      successResponse
    );

    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(checkUserAuthThunk());

    // 5. Проверяем статус thunk
    expect(result.meta.requestStatus).toBe('fulfilled');

    // 6. Проверяем стейт
    const state = store.getState().user;
    expect(state.user).not.toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
    expect(state.user).toHaveProperty('name');
    expect(state.user).toHaveProperty('email');
  });

  it('проверка запроса/ответа при отсутствии токена', async () => {
    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    const result = await store.dispatch(checkUserAuthThunk());

    const state = store.getState().user;

    expect(result.meta.requestStatus).toBe('fulfilled');
    expect(state.user).toBeNull();
  });
});
