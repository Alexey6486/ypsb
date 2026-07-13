import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TWsData } from '@utils/types';

type TProfileWsState = {
  isConnected: boolean;
  data: TWsData;
  error: string | null;
  isLoading: boolean;
};

const initialState: TProfileWsState = {
  isConnected: false,
  data: { orders: [], total: 0, totalToday: 0 },
  error: null,
  isLoading: false,
};

export const profileWsSlice = createSlice({
  name: 'profileWs',
  initialState,
  selectors: {
    selectWsData: (state: TProfileWsState) => state.data,
  },
  reducers: {
    // Управляющие редьюсеры
    connect: (state: TProfileWsState) => {
      state.isLoading = true;
      state.error = null;
    },
    disconnect: (state: TProfileWsState) => {
      state.isConnected = false;
      state.data = { orders: [], total: 0, totalToday: 0 };
      state.isLoading = false;
    },
    // Событийные редьюсеры
    onOpen: (state: TProfileWsState) => {
      state.isLoading = false;
      state.isConnected = true;
      state.error = null;
    },
    onMessage: (state: TProfileWsState, action: PayloadAction<TWsData>) => {
      state.data = action.payload;
    },
    onError: (state: TProfileWsState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    onClose: (state: TProfileWsState) => {
      state.isConnected = false;
      state.isLoading = false;
    },
  },
});

export const { selectWsData } = profileWsSlice.selectors;
