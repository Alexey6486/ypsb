import {
  type CaseReducer,
  createAsyncThunk,
  createSlice,
  type PayloadAction,
  type GetThunkAPI,
} from '@reduxjs/toolkit';

import { request } from '@utils/api';
import { URLS } from '@utils/constants';
import { formatWsData } from '@utils/format';

import type { RootState } from '@services/store';
import type { TOrderCardUI, TNullable, TOrderDto } from '@utils/types';

export type TModalDealState = {
  order: TOrderCardUI | null;
  isLoading: boolean;
  error: TNullable<string>;
};

const initialState: TModalDealState = {
  order: null,
  isLoading: false,
  error: null,
};

type ThunkApiConfig = {
  state: RootState;
  rejectValue: string;
  extra?: unknown;
};

export const fetchOrderByIdThunk = createAsyncThunk<
  TNullable<TOrderCardUI>,
  string,
  ThunkApiConfig
>(
  'modalDeal/fetchOrderById',
  async (orderId: string, thunkApi: GetThunkAPI<ThunkApiConfig>) => {
    try {
      const { order }: { order: TOrderDto } = await request(
        `${URLS.POST_ORDER}/${orderId}`
      );
      const ingredients = thunkApi.getState().ingredients.ingredients;
      const result = formatWsData([order], ingredients);

      return result[0] ?? null;
    } catch (error: unknown) {
      console.log('fetch order by id', { error });
      return thunkApi.rejectWithValue('Не удалось найти заказ.');
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByIdThunk.pending, (state: TModalDealState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByIdThunk.rejected,
        (state: TModalDealState, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      .addCase(
        fetchOrderByIdThunk.fulfilled,
        (state: TModalDealState, action: PayloadAction<TNullable<TOrderCardUI>>) => {
          state.order = action.payload;
          state.isLoading = false;
        }
      );
  },
});

export const { selectModalDeal } = modalDealSlice.selectors;
export default modalDealSlice.reducer;
