import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { URLS } from '@utils/constants';

import type { TOrder, TOrderDetails, TNullable } from '@utils/types';

export type TModalOrderState = {
  details: TNullable<TOrderDetails>;
  isLoading: boolean;
  error: TNullable<string>;
};

const initialState: TModalOrderState = {
  details: null,
  isLoading: false,
  error: null,
};

export const sendOrderThunk = createAsyncThunk<TOrderDetails, TOrder>(
  'modalOrder/sendOrder',
  async (data: TOrder) => {
    const response = await fetch(URLS.POST_ORDER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: data.ingredients,
      }),
    });

    if (!response.ok) throw new Error('Ошибка запроса');

    const json = (await response.json()) as TOrderDetails;

    if (!json.success) {
      throw Error('Ошибка запроса');
    }

    return json;
  }
);

const modalOrderSlice = createSlice({
  name: 'modalOrder',
  initialState,
  reducers: {
    setModalOrderData: (state, { payload }: PayloadAction<TOrderDetails | null>) => {
      state.details = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrderThunk.pending, (state: TModalOrderState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        sendOrderThunk.rejected,
        (
          state: TModalOrderState,
          action: PayloadAction<{
            error: { message: string };
          }>
        ) => {
          state.isLoading = false;
          state.error = action.payload.error.message;
        }
      )
      .addCase(
        sendOrderThunk.fulfilled,
        (state: TModalOrderState, action: PayloadAction<TOrderDetails>) => {
          state.details = action.payload;
          state.isLoading = false;
        }
      );
  },
});

export const { setModalOrderData } = modalOrderSlice.actions;
export const selectModalOrder = (state: {
  modalOrder: TModalOrderState;
}): TModalOrderState => state.modalOrder;
export default modalOrderSlice.reducer;
