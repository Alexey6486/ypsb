import { describe, it, expect } from 'vitest';

import {
  fetchOrderByIdThunk,
  modalDealSlice,
  type TModalDealState,
} from '@services/slices/modal-deal-slice';
import { order_card_test } from '@utils/constants';

import type { PayloadAction } from '@reduxjs/toolkit';

const initState: TModalDealState = { order: null, isLoading: false, error: null };

describe('modal-deal-slice', () => {
  it('должен перевести isLoading в состояние true при выполнении запроса', () => {
    // 1. Arrange: Готовим входные данные
    const id = '1';
    const action = fetchOrderByIdThunk.pending(id, undefined);

    // 2. Act: Запускаем редьюсер
    const nextState = modalDealSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeTruthy();
    expect(nextState.error).toBeNull();
  });

  it('должен сохранить результат в state при успешном запросе и перевести isLoading в состояние false', () => {
    // 1. Arrange: Готовим входные данные
    const action = {
      type: fetchOrderByIdThunk.fulfilled.type,
      payload: order_card_test,
    } as PayloadAction<typeof order_card_test>;

    // 2. Act: Запускаем редьюсер
    const nextState = modalDealSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeFalsy();
    expect(nextState.order).toEqual(order_card_test);
  });

  it('должен сохранить тектс ошибки в error и перевести isLoading в состояние false', () => {
    // 1. Arrange: Готовим входные данные
    const errorPayload = 'Network error';
    const action = {
      type: fetchOrderByIdThunk.rejected.type,
      payload: errorPayload,
    } as PayloadAction<string>;

    // 2. Act: Запускаем редьюсер
    const nextState = modalDealSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeFalsy();
    expect(nextState.error).toBe(errorPayload);
  });
});
