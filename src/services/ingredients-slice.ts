import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { INGREDIENTS_URLS } from '@utils/constants';

import type { TIngredient, TNullable, TIngredientsSorted } from '@utils/types';

export type TIngredientsState = {
  ingredients: TNullable<TIngredientsSorted>;
  order: {
    bun: TNullable<TIngredient>;
    ingredients: TIngredient[];
  };
  isLoading: boolean;
  error: TNullable<string>;
};

const initialState: TIngredientsState = {
  ingredients: null,
  order: {
    bun: null,
    ingredients: [],
  },
  isLoading: true,
  error: null,
};

export const fetchIngredientsThunk = createAsyncThunk<TNullable<TIngredientsSorted>>(
  'ingredients/fetchIngredients',
  async () => {
    const response = await fetch(INGREDIENTS_URLS.GET);

    if (!response.ok) throw new Error('Ошибка запроса');

    const json = (await response.json()) as {
      data: TIngredient[];
      success: boolean;
    };

    if (!json.success) {
      throw Error('Ошибка запроса');
    }

    const { bun, main, sauce } = json.data.reduce(
      (acc, item) => {
        return { ...acc, [item.type]: [...acc[item.type], item] };
      },
      { bun: [], main: [], sauce: [] }
    );

    return { bun, main, sauce };
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setOrderIngredient: (state, { payload }: PayloadAction<TIngredient>) => {
      state.order = {
        ...state.order,
        bun: payload.type === 'bun' ? payload : state.order.bun,
        ingredients:
          payload.type !== 'bun'
            ? [...state.order.ingredients, payload]
            : state.order.ingredients,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state: TIngredientsState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredientsThunk.rejected,
        (
          state: TIngredientsState,
          action: PayloadAction<{
            error: { message: string };
          }>
        ) => {
          state.isLoading = false;
          state.error = action.payload.error.message;
        }
      )
      .addCase(
        fetchIngredientsThunk.fulfilled,
        (
          state: TIngredientsState,
          action: PayloadAction<TNullable<TIngredientsSorted>>
        ) => {
          state.ingredients = action.payload;
          state.isLoading = false;
        }
      );
  },
});

export const { setOrderIngredient } = ingredientsSlice.actions;
export const selectIngredients = (state: {
  ingredients: TIngredientsState;
}): TIngredientsState => state.ingredients;
export default ingredientsSlice.reducer;
