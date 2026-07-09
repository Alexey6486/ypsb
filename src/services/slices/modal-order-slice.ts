import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { defaultRequestOptions, request } from '@utils/api';
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
  async (data: TOrder, thunkApi) => {
    try {
      const response: TOrderDetails = await request(URLS.POST_ORDER, {
        ...defaultRequestOptions,
        body: JSON.stringify({
          ingredients: data.ingredients,
        }),
      });

      return response;
    } catch (error: unknown) {
      return thunkApi.rejectWithValue(error?.message ?? 'Не удалось отправить заказ.');
    }
  }
);

export const modalOrderSlice = createSlice({
  name: 'modalOrder',
  initialState,
  selectors: {
    selectModalOrder: (state) => state.details,
    selectIsLoading: (state) => state.isLoading,
  },
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

export const { selectModalOrder, selectIsLoading } = modalOrderSlice.selectors;
export default modalOrderSlice.reducer;
