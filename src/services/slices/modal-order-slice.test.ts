import { describe, it, expect } from 'vitest';

import { modalOrderSlice, sendOrderThunk, initialState } from './modal-order-slice';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrderDetails } from '@utils/types';

const order: TOrderDetails = {
  name: 'string',
  order: {
    number: 1,
  },
  success: true,
};

describe('modal-order-slice', () => {
  it('тест начального состояния state', () => {
    // 1. Arrange: Готовим входные данные
    const initTestState = undefined;
    const action = { type: '' };

    // 2. Act: Запускаем редьюсер
    const result = modalOrderSlice.reducer(initTestState, action);

    // 3. Assert: Проверяем результат
    expect(result).toEqual(initialState);
  });
  it('тест изменения state при статусе выполнения запроса pending', () => {
    // 1. Arrange: Готовим входные данные
    const order = {};
    const action = sendOrderThunk.pending(order, undefined);

    // 2. Act: Запускаем редьюсер
    const nextState = modalOrderSlice.reducer(initialState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeTruthy();
    expect(nextState.error).toBeNull();
  });

  it('тест изменения state при статусе выполнения запроса fulfilled', () => {
    // 1. Arrange: Готовим входные данные

    const action = {
      type: sendOrderThunk.fulfilled.type,
      payload: order,
    } as PayloadAction<TOrderDetails>;

    // 2. Act: Запускаем редьюсер
    const nextState = modalOrderSlice.reducer(initialState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeFalsy();
    expect(nextState.details).toEqual(order);
  });

  it('тест изменения state при статусе выполнения запроса rejected', () => {
    // 1. Arrange: Готовим входные данные
    const errorPayload = 'Network error';
    const action = {
      type: sendOrderThunk.rejected.type,
      payload: errorPayload,
    } as PayloadAction<string>;

    // 2. Act: Запускаем редьюсер
    const nextState = modalOrderSlice.reducer(initialState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeFalsy();
    expect(nextState.error).toBe(errorPayload);
  });
});
