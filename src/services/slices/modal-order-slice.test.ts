import { describe, it, expect } from 'vitest';

import {
  modalOrderSlice,
  sendOrderThunk,
  type TModalOrderState,
} from './modal-order-slice';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrderDetails } from '@utils/types';

const initState: TModalOrderState = { details: null, isLoading: false, error: null };

const order: TOrderDetails = {
  name: 'string',
  order: {
    number: 1,
  },
  success: true,
};

describe('modal-order-slice', () => {
  it('должен перевести isLoading в состояние true при выполнении запроса', () => {
    // 1. Arrange: Готовим входные данные
    const order = {};
    const action = sendOrderThunk.pending(order, undefined);

    // 2. Act: Запускаем редьюсер
    const nextState = modalOrderSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeTruthy();
    expect(nextState.error).toBeNull();
  });

  it('должен сохранить результат в state при успешном запросе и перевести isLoading в состояние false', () => {
    // 1. Arrange: Готовим входные данные

    const action = {
      type: sendOrderThunk.fulfilled.type,
      payload: order,
    } as PayloadAction<TOrderDetails>;

    // 2. Act: Запускаем редьюсер
    const nextState = modalOrderSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeFalsy();
    expect(nextState.details).toEqual(order);
  });

  it('должен сохранить тектс ошибки в error и перевести isLoading в состояние false', () => {
    // 1. Arrange: Готовим входные данные
    const errorPayload = 'Network error';
    const action = {
      type: sendOrderThunk.rejected.type,
      payload: { error: { message: errorPayload } },
    } as PayloadAction<{ error: { message: string } }>;

    // 2. Act: Запускаем редьюсер
    const nextState = modalOrderSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeFalsy();
    expect(nextState.error).toBe(errorPayload);
  });
});
