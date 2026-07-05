import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { request } from '@utils/api';
import { INGREDIENTS, URLS } from '@utils/constants';

import type {
  TIngredientUI,
  TIngredientDto,
  TNullable,
  TIngredientsSorted,
  TIngredientType,
} from '@utils/types';

export type TIngredientsState = {
  ingredients: TNullable<TIngredientsSorted>;
  order: {
    bun: TNullable<TIngredientUI>;
    ingredients: TIngredientUI[];
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
  async (_, thunkApi) => {
    try {
      const response: { data: TIngredientDto[]; success: boolean } = await request(
        URLS.GET_INGREDIENTS
      );

      const { bun, main, sauce } = response.data.reduce(
        (acc, item) => {
          return {
            ...acc,
            [item.type]: [...acc[item.type], { ...item, nanoid: '', counter: 0 }],
          };
        },
        { bun: [], main: [], sauce: [] }
      );

      return { bun, main, sauce };
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(
        error?.message ?? 'Не удалось получить ингредиенты.'
      );
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectOrder: (state) => state.order,
    selectIsLoading: (state) => state.isLoading,
  },
  reducers: {
    setOrderIngredient: (state, { payload }: PayloadAction<TIngredientUI>) => {
      state.order = {
        ...state.order,
        bun: payload.type === INGREDIENTS.BUN ? payload : state.order.bun,
        ingredients:
          payload.type !== INGREDIENTS.BUN
            ? [...state.order.ingredients, payload]
            : state.order.ingredients,
      };
      state.ingredients = {
        ...state.ingredients,
        [payload.type]: state.ingredients[payload.type].map((el) => {
          if (el._id === payload._id) {
            return {
              ...el,
              counter: payload.type === INGREDIENTS.BUN ? 2 : el.counter + 1,
            };
          } else if (
            payload.type === INGREDIENTS.BUN &&
            el.type === INGREDIENTS.BUN &&
            el._id !== payload._id
          ) {
            return { ...el, counter: 0 };
          } else {
            return el;
          }
        }),
      };
    },
    removeIngredient: (
      state,
      { payload }: PayloadAction<{ id: string; nanoid: string; type: TIngredientType }>
    ) => {
      state.order = {
        ...state.order,
        ingredients: state.order.ingredients.filter(
          (el) => el.nanoid !== payload.nanoid
        ),
      };
      state.ingredients = {
        ...state.ingredients,
        [payload.type]: state.ingredients[payload.type].map((el) =>
          el._id === payload.id ? { ...el, counter: el.counter - 1 } : el
        ),
      };
    },
    resetOrder: (state) => {
      state.order = {
        bun: null,
        ingredients: [],
      };
      state.ingredients = {
        bun: state.ingredients.bun.map((el) => ({ ...el, counter: 0 })),
        main: state.ingredients.main.map((el) => ({ ...el, counter: 0 })),
        sauce: state.ingredients.sauce.map((el) => ({ ...el, counter: 0 })),
      };
    },
    moveOrderIngredient: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const item = state.order.ingredients.splice(from, 1)[0];
      state.order.ingredients.splice(to, 0, item);
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

export const { setOrderIngredient, removeIngredient, resetOrder, moveOrderIngredient } =
  ingredientsSlice.actions;
export const { selectIngredients, selectOrder, selectIsLoading } =
  ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
