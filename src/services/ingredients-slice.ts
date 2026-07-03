import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { URLS } from '@utils/constants';

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
  async () => {
    const response = await fetch(URLS.GET_INGREDIENTS);

    if (!response.ok) throw new Error('Ошибка запроса');

    const json = (await response.json()) as {
      data: TIngredientDto[];
      success: boolean;
    };

    if (!json.success) {
      throw Error('Ошибка запроса');
    }

    const { bun, main, sauce } = json.data.reduce(
      (acc, item) => {
        return {
          ...acc,
          [item.type]: [...acc[item.type], { ...item, nanoid: '', counter: 0 }],
        };
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
    setOrderIngredient: (state, { payload }: PayloadAction<TIngredientUI>) => {
      state.order = {
        ...state.order,
        bun: payload.type === 'bun' ? payload : state.order.bun,
        ingredients:
          payload.type !== 'bun'
            ? [...state.order.ingredients, payload]
            : state.order.ingredients,
      };
      state.ingredients = {
        ...state.ingredients,
        [payload.type]: state.ingredients[payload.type].map((el) => {
          if (el._id === payload._id) {
            return { ...el, counter: payload.type === 'bun' ? 2 : el.counter + 1 };
          } else if (
            payload.type === 'bun' &&
            el.type === 'bun' &&
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

export const { setOrderIngredient, removeIngredient, resetOrder } =
  ingredientsSlice.actions;
export const selectIngredients = (state: {
  ingredients: TIngredientsState;
}): TIngredientsState => state.ingredients;
export default ingredientsSlice.reducer;
