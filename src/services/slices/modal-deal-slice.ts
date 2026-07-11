import { type CaseReducer, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TOrderCardUI } from '@utils/types';

export type TModalDealState = {
  order: TOrderCardUI | null;
};

const initialState: TModalDealState = {
  order: null,
};

export const modalDealSlice = createSlice({
  name: 'modalDeal',
  initialState,
  selectors: {
    selectModalDeal: (state) => state.order,
  },
  reducers: {
    setModalDealData: ((state, { payload }: PayloadAction<TOrderCardUI | null>) => {
      state.order = payload;
    }) as CaseReducer<TModalDealState, PayloadAction<TOrderCardUI | null>>,
  },
});

export const { selectModalDeal } = modalDealSlice.selectors;
export default modalDealSlice.reducer;
