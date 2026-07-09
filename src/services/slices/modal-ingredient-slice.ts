import { type CaseReducer, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredientUI } from '@utils/types';

export type TModalIngredientState = {
  ingredient: TIngredientUI | null;
};

const initialState: TModalIngredientState = {
  ingredient: null,
};

export const modalIngredientSlice = createSlice({
  name: 'modalIngredient',
  initialState,
  selectors: {
    selectModalIngredient: (state) => state.ingredient,
  },
  reducers: {
    setModalIngredientData: ((
      state,
      { payload }: PayloadAction<TIngredientUI | null>
    ) => {
      state.ingredient = payload;
    }) as CaseReducer<TModalIngredientState, PayloadAction<TIngredientUI | null>>,
  },
});

// export const { setModalIngredientData } = modalIngredientSlice.actions;
export const { selectModalIngredient } = modalIngredientSlice.selectors;
export default modalIngredientSlice.reducer;
