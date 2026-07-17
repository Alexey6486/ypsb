import { describe, it, expect } from 'vitest';

import { feedWsSlice, type TFeedWsState } from '@services/slices/feed-ws-slice';
import { order_card_test } from '@utils/constants';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TWsData } from '@utils/types';

const initState: TFeedWsState = {
  isConnected: false,
  data: { orders: [], total: 0, totalToday: 0 },
  error: null,
  isLoading: false,
};

describe('feed-ws-slice', () => {
  it('тест начала подключения', () => {
    // 1. Arrange: Готовим входные данные
    const action = {
      type: 'feedWs/connect',
    };

    // 2. Act: Запускаем редьюсер
    const result = feedWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.isLoading).toBeTruthy();
    expect(result.isConnected).toBeFalsy();
  });

  it('тест разрыва соединения', () => {
    // 1. Arrange: Готовим входные данные
    const action = {
      type: 'feedWs/disconnect',
    };

    // 2. Act: Запускаем редьюсер
    const result = feedWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.isConnected).toBeFalsy();
    expect(result.isLoading).toBeFalsy();
  });

  it('тест состояния подключенного сокета', () => {
    // 1. Arrange: Готовим входные данные
    const action = {
      type: 'feedWs/onOpen',
    };

    // 2. Act: Запускаем редьюсер
    const result = feedWsSlice.reducer(initState, action);

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
      type: 'feedWs/onMessage',
      payload,
    } as PayloadAction<TWsData>;

    // 2. Act: Запускаем редьюсер
    const result = feedWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.data.orders).toHaveLength(1);
  });

  it('тест получения ошибки по сокету', () => {
    // 1. Arrange: Готовим входные данные
    const payload = 'Network error';
    const action = {
      type: 'feedWs/onError',
      payload,
    } as PayloadAction<string>;

    // 2. Act: Запускаем редьюсер
    const result = feedWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.error).toBe(payload);
  });

  it('тест закрытия соединения', () => {
    // 1. Arrange: Готовим входные данные
    const action = {
      type: 'feedWs/onClose',
    };

    // 2. Act: Запускаем редьюсер
    const result = feedWsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(result.isConnected).toBeFalsy();
    expect(result.isLoading).toBeFalsy();
  });
});
