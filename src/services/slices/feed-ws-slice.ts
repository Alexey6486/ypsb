import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TWsData } from '@utils/types';

export type TFeedWsState = {
  isConnected: boolean;
  data: TWsData;
  error: string | null;
  isLoading: boolean;
};

const initialState: TFeedWsState = {
  isConnected: false,
  data: { orders: [], total: 0, totalToday: 0 },
  error: null,
  isLoading: false,
};

export const feedWsSlice = createSlice({
  name: 'feedWs',
  initialState,
  selectors: {
    isWsConnected: (state: TFeedWsState) => state.isConnected,
    selectWsData: (state: TFeedWsState) => state.data,
    isWsLoading: (state: TFeedWsState) => state.isLoading,
    selectError: (state: TFeedWsState) => state.error,
  },
  reducers: {
    // Управляющие редьюсеры
    connect: (state: TFeedWsState) => {
      state.isLoading = true;
      state.error = null;
    },
    disconnect: (state: TFeedWsState) => {
      state.isConnected = false;
      state.data = { orders: [], total: 0, totalToday: 0 };
      state.isLoading = false;
    },
    // Событийные редьюсеры
    onOpen: (state: TFeedWsState) => {
      state.isLoading = false;
      state.isConnected = true;
      state.error = null;
    },
    onMessage: (state: TFeedWsState, action: PayloadAction<TWsData>) => {
      state.data = action.payload;
    },
    onError: (state: TFeedWsState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    onClose: (state: TFeedWsState) => {
      state.isConnected = false;
      state.isLoading = false;
    },
  },
});

export const { selectWsData, isWsLoading, isWsConnected } = feedWsSlice.selectors;
