import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { INGREDIENTS_URLS } from '@utils/constants';

import type { RootState } from '@services/store';
import type { TIngredient } from '@utils/types';

export type IngredientsState = {
  ingredients: { bun: TIngredient[]; main: TIngredient[]; sauce: TIngredient[] } | null;
  order: TIngredient[] | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  ingredients: null,
  order: null,
  isLoading: true,
  error: null,
};

export const fetchIngredientsThunk = createAsyncThunk<
  {
    bun: TIngredient[];
    main: TIngredient[];
    sauce: TIngredient[];
  },
  void
>('ingredients/fetchIngredients', async () => {
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
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state: IngredientsState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredientsThunk.rejected,
        (
          state: IngredientsState,
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
          state: IngredientsState,
          action: PayloadAction<{
            bun: TIngredient[];
            main: TIngredient[];
            sauce: TIngredient[];
          }>
        ) => {
          state.ingredients = action.payload;
          state.isLoading = false;
        }
      );
  },
});

export const selectIngredients = (state: RootState): RootState['ingredients'] =>
  state.ingredients;
export const ingredientsReducer = ingredientsSlice.reducer;
