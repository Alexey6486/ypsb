import { describe, it, expect } from 'vitest';

import { profileWsSlice } from '@services/slices/profile-ws-slice';
import { order_card_test } from '@utils/constants';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TFeedWsState } from '@services/slices/feed-ws-slice';
import type { TWsData } from '@utils/types';

const initState: TFeedWsState = {
  isConnected: false,
  data: { orders: [], total: 0, totalToday: 0 },
  error: null,
  isLoading: false,
};

describe('profile-ws-slice', () => {
  it('тест начального состояния state', () => {
    // 1. Arrange: Готовим входные данные
    const initTestState = undefined;
    const action = { type: '' };

    // 2. Act: Запускаем редьюсер
    const result = profileWsSlice.reducer(initTestState, action);

    // 3. Assert: Проверяем результат
    expect(result).toEqual(initState);
  });
  it('тест начала подключения', () => {
    // 1. Arrange: Готовим входные данные
    const action = {
      type: 'profileWs/connect',
    };

    // 2. Act: Запускаем редьюсер
    const result = profileWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.isLoading).toBeTruthy();
    expect(result.isConnected).toBeFalsy();
  });

  it('тест разрыва соединения', () => {
    // 1. Arrange: Готовим входные данные
    const action = {
      type: 'profileWs/disconnect',
    };

    // 2. Act: Запускаем редьюсер
    const result = profileWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.isConnected).toBeFalsy();
    expect(result.isLoading).toBeFalsy();
  });

  it('тест состояния подключенного сокета', () => {
    // 1. Arrange: Готовим входные данные
    const action = {
      type: 'profileWs/onOpen',
    };

    // 2. Act: Запускаем редьюсер
    const result = profileWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.isConnected).toBeTruthy();
    expect(result.isLoading).toBeFalsy();
  });

  it('тест получения данных по сокету', () => {
    // 1. Arrange: Готовим входные данные
    const payload = {
      orders: [order_card_test],
      total: 1,
      totalToday: 1,
    };
    const action = {
      type: 'profileWs/onMessage',
      payload,
    } as PayloadAction<TWsData>;

    // 2. Act: Запускаем редьюсер
    const result = profileWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.data.orders).toHaveLength(1);
  });

  it('тест получения ошибки по сокету', () => {
    // 1. Arrange: Готовим входные данные
    const payload = 'Network error';
    const action = {
      type: 'profileWs/onError',
      payload,
    } as PayloadAction<string>;

    // 2. Act: Запускаем редьюсер
    const result = profileWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.error).toBe(payload);
  });

  it('тест закрытия соединения', () => {
    // 1. Arrange: Готовим входные данные
    const action = {
      type: 'profileWs/onClose',
    };

    // 2. Act: Запускаем редьюсер
    const result = profileWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.isConnected).toBeFalsy();
    expect(result.isLoading).toBeFalsy();
  });
});
