import { createSlice } from '@reduxjs/toolkit';

import type { TNullable, TOrderCardUI } from '@utils/types';

export type TFeedState = {
  feed: TNullable<TOrderCardUI[]>;
  ws: TNullable<WebSocket>;
  isLoading: boolean;
  error: TNullable<string>;
};

const initialState: TFeedState = {
  feed: null,
  ws: null,
  isLoading: true,
  error: null,
};

// export const fetchFeedThunk = createAsyncThunk<{
//   ws: WebSocket;
//   feed: TNullable<TOrderCardUI[]>;
// }>('feed/fetchFeed', async (_, thunkApi) => {
//   try {
//     const ws = new WebSocket(`${BASE_WS_URL}all`);
//     console.log('[ws]', { ws });
//
//     ws.onopen = (event: Event): void => {
//       console.log('[ws] соединение установлено', { event });
//     };
//
//     ws.onmessage = (event: MessageEvent<string>): void => {
//       console.log('[ws] получены данные', { event });
//
//       if (event.data === 'ping') {
//         console.log('[ws] сервис фрагмент ping-pong');
//         ws.send('pong');
//       }
//
//       const response = event?.data;
//       if (response) {
//         const wsDataResponse = JSON.parse(response) as TOrdersResponseDto;
//         console.log('[ws] данные', { wsDataResponse });
//       }
//     };
//
//     ws.onclose = (event: CloseEvent): void => {
//       if (event.wasClean) {
//         console.log('[ws] соединение закрыто корректно', { event });
//       } else {
//         console.log('[ws] соединение закрыто с кодом', { event });
//       }
//     };
//
//     ws.onerror = (event: Event): void => {
//       console.log('[ws] ошибка', { event });
//     };
//
//     return { ws, feed: null };
//   } catch (error: unknown) {
//     return thunkApi.rejectWithValue(
//       error?.message ?? 'Не удалось получить ленту заказов.'
//     );
//   }
// });

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    selectFeedWs: (state) => state.ws,
  },
  reducers: {
    closeFeedWs: (state) => {
      if (state.ws) {
        state.ws.close(1000, 'close ws');
        state.ws = null;
      }

      state.feed = null;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchFeedThunk.pending, (state: TFeedState) => {
  //       state.isLoading = true;
  //       state.error = null;
  //     })
  //     .addCase(
  //       fetchFeedThunk.rejected,
  //       (
  //         state: TFeedState,
  //         action: PayloadAction<{
  //           error: { message: string };
  //         }>
  //       ) => {
  //         state.isLoading = false;
  //         state.error = action.payload.error.message;
  //       }
  //     )
  //     .addCase(
  //       fetchFeedThunk.fulfilled,
  //       (
  //         state: TFeedState,
  //         action: PayloadAction<{ ws: WebSocket; feed: TNullable<TOrderCardUI[]> }>
  //       ) => {
  //         state.ws = action.payload.ws;
  //         state.feed = action.payload.feed;
  //         state.isLoading = false;
  //       }
  //     );
  // },
});

// export const { selectFeedWs } = feedSlice.selectors;
export default feedSlice.reducer;
