import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TNullable, TOrderCardUI } from '@utils/types';

// const connect: PayloadActionCreator<void, "socket/connect"> = createAction('socket/connect');
// const disconnect: PayloadActionCreator<void, "socket/disconnect"> = createAction('socket/disconnect');
// const sendMessage: PayloadActionCreator<void, "socket/sendMessage"> = createAction('socket/sendMessage');
//
// const onOpen: PayloadActionCreator<void, "socket/onOpen"> = createAction('socket/onOpen');
// const onMessage: PayloadActionCreator<void, "socket/onMessage"> = createAction('socket/onMessage');
// const onError: PayloadActionCreator<void, "socket/onError"> = createAction('socket/onError');
// const onClose: PayloadActionCreator<void, "socket/onClose"> = createAction('socket/onClose');

type TWsData = { orders: TNullable<TOrderCardUI[]>; total: number; totalToday: number };

type TSocketState = {
  isConnected: boolean;
  data: TWsData;
  error: string | null;
  isLoading: boolean;
};

const initialState: TSocketState = {
  isConnected: false,
  data: { orders: [], total: 0, totalToday: 0 },
  error: null,
  isLoading: false,
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  selectors: {
    isWsConnected: (state: TSocketState) => state.isConnected,
    selectWsData: (state: TSocketState) => state.data,
    isWsLoading: (state: TSocketState) => state.isLoading,
    selectWsError: (state: TSocketState) => state.error,
  },
  reducers: {
    // Управляющие редьюсеры
    connect: (state: TSocketState) => {
      state.isLoading = true;
      state.error = null;
    },
    disconnect: (state: TSocketState) => {
      state.isConnected = false;
      state.data = { orders: [], total: 0, totalToday: 0 };
      state.isLoading = false;
    },
    // Событийные редьюсеры
    onOpen: (state: TSocketState) => {
      state.isLoading = false;
      state.isConnected = true;
      state.error = null;
    },
    onMessage: (state: TSocketState, action: PayloadAction<TWsData>) => {
      state.data = action.payload;
    },
    onError: (state: TSocketState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    onClose: (state: TSocketState) => {
      state.isConnected = false;
      state.isLoading = false;
    },
  },
});

export const { selectWsData, isWsLoading, isWsConnected } = socketSlice.selectors;
export default socketSlice.reducer;
