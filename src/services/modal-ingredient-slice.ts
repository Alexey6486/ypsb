import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredientUI } from '@utils/types';

export type TModalIngredientState = {
  ingredient: TIngredientUI | null;
};

const initialState: TModalIngredientState = {
  ingredient: null,
};

const modalIngredientSlice = createSlice({
  name: 'modalIngredient',
  initialState,
  reducers: {
    setModalIngredientData: (
      state,
      { payload }: PayloadAction<TIngredientUI | null>
    ) => {
      state.ingredient = payload;
    },
  },
});

export const { setModalIngredientData } = modalIngredientSlice.actions;
export const selectModalIngredient = (state: {
  modalIngredient: TModalIngredientState;
}): TModalIngredientState => state.modalIngredient;
export default modalIngredientSlice.reducer;
