import { socketSlice } from '@services/slices/ws-slice';
import { refreshToken } from '@utils/api';
import { formatWsData } from '@utils/format';

import type { Middleware, MiddlewareAPI, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@services/store';
import type { TOrdersResponseDto } from '@utils/types';

let ws: WebSocket | null = null;
let isConnected = false; // Флаг: считается ли пользователь подключённым?
const reconnectPeriod = 3000;
let currentUrl = '';
let reconnectTimerId = 0;

const socketMiddleware = (withTokenRefresh: boolean): Middleware => {
  return (store: MiddlewareAPI<AppDispatch, RootState>) =>
    (next) =>
    (action: PayloadAction) => {
      // console.log('[ws mw]', { store, next, action });
      const { type } = action;

      if (type === 'socket/connect') {
        const { payload: url } = action as PayloadAction<string>;

        // Закрываем старое соединение, если есть
        if (ws) {
          ws.close();
        }

        // Создаём новый WebSocket
        ws = new WebSocket(url);
        isConnected = true;
        currentUrl = url;

        // Обработчик открытия соединения
        ws.onopen = (): void => {
          // console.log('[ws] соединение установлено', { event });

          store.dispatch(socketSlice.actions.onOpen());
        };

        // Обработчик входящих сообщений
        ws.onmessage = (event: MessageEvent<string>): void => {
          try {
            // console.log('[ws] получены данные', { event });

            const response = event?.data;
            if (response) {
              const wsDataResponse = JSON.parse(response) as TOrdersResponseDto;
              // console.log('[ws] данные', { wsDataResponse });

              // Новая логика: проверяем токен
              if (
                withTokenRefresh &&
                wsDataResponse.message === 'Invalid or missing token'
              ) {
                refreshToken()
                  .then((refreshedData) => {
                    const wssUrl = new URL(url); // Новый URL, на основании того, который сохраняли
                    wssUrl.searchParams.set(
                      'token',
                      refreshedData.accessToken.replace('Bearer ', '')
                    );

                    store.dispatch(socketSlice.actions.connect(wssUrl.toString()));
                  })
                  .catch((error: unknown) => {
                    console.log({ error });
                    store.dispatch(
                      socketSlice.actions.onError('Не удалось обновить токен')
                    );
                  });

                store.dispatch(socketSlice.actions.disconnect());
                return;
              }

              const ingredients = store.getState()?.ingredients?.ingredients;
              store.dispatch(
                socketSlice.actions.onMessage({
                  orders: formatWsData(wsDataResponse.orders, ingredients),
                  total: wsDataResponse.total,
                  totalToday: wsDataResponse.totalToday,
                })
              );
            }
          } catch (error: unknown) {
            console.log({ error });
            store.dispatch(
              socketSlice.actions.onError('Ошибка парсинга сообщения от сервера')
            );
          }
        };

        // Обработчик ошибок
        ws.onerror = (): void => {
          store.dispatch(socketSlice.actions.onError('Ошибка WebSocket-соединения'));
        };

        // Обработчик закрытия соединения
        ws.onclose = (): void => {
          store.dispatch(socketSlice.actions.onClose());
          ws = null;

          if (isConnected) {
            reconnectTimerId = setTimeout(() => {
              store.dispatch(socketSlice.actions.connect(currentUrl));
            }, reconnectPeriod);
          }
        };
      }

      // Обработка экшена disconnect
      if (type === 'socket/disconnect') {
        if (ws) {
          ws.close();
          ws = null;
        }

        clearTimeout(reconnectTimerId);
        reconnectTimerId = 0;
        isConnected = false;
      }

      return next(action);
    };
};

export default socketMiddleware;
