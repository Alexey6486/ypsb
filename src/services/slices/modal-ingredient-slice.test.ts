import { describe, it, expect } from 'vitest';

import { ingredient_test } from '@utils/constants';

import {
  modalIngredientSlice,
  type TModalIngredientState,
} from './modal-ingredient-slice';

describe('modal-ingredient-slice', () => {
  it('тест начального состояния state', () => {
    // 1. Arrange: Готовим входные данные
    const initTestState = undefined;
    const action = { type: '' };

    // 2. Act: Запускаем редьюсер
    const result = modalIngredientSlice.reducer(initTestState, action);

    // 3. Assert: Проверяем результат
    expect(result).toEqual({ ingredient: null });
  });

  it('тест добавления ingredient в state', () => {
    // 1. Arrange: Готовим входные данные
    const initState: TModalIngredientState = { ingredient: null };

    // 2. Act: Запускаем редьюсер
    const result = modalIngredientSlice.reducer(
      initState,
      modalIngredientSlice.actions.setModalIngredientData(ingredient_test)
    );

    // 3. Assert: Проверяем результат
    expect(result).toEqual({ ingredient: ingredient_test });
  });
});
