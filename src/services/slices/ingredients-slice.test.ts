import { describe, it, expect } from 'vitest';

import {
  fetchIngredientsThunk,
  ingredientsSlice,
  type TIngredientsState,
} from '@services/slices/ingredients-slice';
import {
  ingredient_main_test,
  ingredient_test,
  ingredients_test,
} from '@utils/constants';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredientsSorted, TIngredientUI } from '@utils/types';

const initState: TIngredientsState = {
  ingredients: null,
  order: {
    bun: null,
    ingredients: [],
  },
  isLoading: true,
  error: null,
};

describe('ingredients-slice', () => {
  it('тест добавления ингредиента в order', () => {
    // 1. Arrange: Готовим входные данные
    const ingredientsAction = {
      type: fetchIngredientsThunk.fulfilled.type,
      payload: ingredients_test,
    } as PayloadAction<TIngredientsSorted>;
    const bunAction = {
      type: 'ingredients/setOrderIngredient',
      payload: ingredient_test,
    } as PayloadAction<TIngredientUI>;
    const mainAction = {
      type: 'ingredients/setOrderIngredient',
      payload: ingredient_main_test,
    } as PayloadAction<TIngredientUI>;

    // 2. Act: Запускаем редьюсеры
    const nextState = ingredientsSlice.reducer(initState, ingredientsAction);
    const bunState = ingredientsSlice.reducer(nextState, bunAction);
    const finalState = ingredientsSlice.reducer(bunState, mainAction);

    // 3. Assert: Проверяем результат
    expect(finalState.order.bun).toEqual(ingredient_test);
  });

  it('тест удаления ингредиента из order', () => {
    // 1. Arrange: Готовим входные данные
    const ingredientsAction = {
      type: fetchIngredientsThunk.fulfilled.type,
      payload: ingredients_test,
    } as PayloadAction<TIngredientsSorted>;
    const mainAction = {
      type: 'ingredients/removeIngredient',
      payload: ingredient_main_test,
    } as PayloadAction<TIngredientUI>;

    // 2. Act: Запускаем редьюсеры
    const nextState = ingredientsSlice.reducer(initState, ingredientsAction);
    const finalState = ingredientsSlice.reducer(nextState, mainAction);

    // 3. Assert: Проверяем результат
    expect(finalState.order.ingredients).toHaveLength(0);
  });

  it('тест очистки order', () => {
    // 1. Arrange: Готовим входные данные
    const ingredientsAction = {
      type: fetchIngredientsThunk.fulfilled.type,
      payload: ingredients_test,
    } as PayloadAction<TIngredientsSorted>;
    const bunAction = {
      type: 'ingredients/setOrderIngredient',
      payload: ingredient_test,
    } as PayloadAction<TIngredientUI>;
    const mainAction = {
      type: 'ingredients/setOrderIngredient',
      payload: ingredient_main_test,
    } as PayloadAction<TIngredientUI>;
    const resetAction = {
      type: 'ingredients/resetOrder',
    } as PayloadAction<undefined>;

    // 2. Act: Запускаем редьюсеры
    const nextState = ingredientsSlice.reducer(initState, ingredientsAction);
    const bunState = ingredientsSlice.reducer(nextState, bunAction);
    const mainState = ingredientsSlice.reducer(bunState, mainAction);
    const finalState = ingredientsSlice.reducer(mainState, resetAction);

    // 3. Assert: Проверяем результат
    expect(finalState.order.bun).toBeNull();
    expect(finalState.order.ingredients).toHaveLength(0);
  });

  it('тест изменения state при статусе выполнения запроса pending', () => {
    // 1. Arrange: Готовим входные данные
    const action = fetchIngredientsThunk.pending(undefined, undefined);

    // 2. Act: Запускаем редьюсер
    const nextState = ingredientsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeTruthy();
    expect(nextState.error).toBeNull();
  });

  it('тест изменения state при статусе выполнения запроса fulfilled', () => {
    // 1. Arrange: Готовим входные данные
    const action = {
      type: fetchIngredientsThunk.fulfilled.type,
      payload: ingredients_test,
    } as PayloadAction<TIngredientsSorted>;

    // 2. Act: Запускаем редьюсер
    const nextState = ingredientsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeFalsy();
    expect(nextState.ingredients).toEqual(ingredients_test);
  });

  it('тест изменения state при статусе выполнения запроса rejected', () => {
    // 1. Arrange: Готовим входные данные
    const errorPayload = 'Network error';
    const action = {
      type: fetchIngredientsThunk.rejected.type,
      payload: { error: { message: errorPayload } },
    } as PayloadAction<{ error: { message: string } }>;

    // 2. Act: Запускаем редьюсер
    const nextState = ingredientsSlice.reducer(initState, action);

    // 3. Assert: Проверяем результат
    expect(nextState.isLoading).toBeFalsy();
    expect(nextState.error).toBe(errorPayload);
  });
});
