import { refreshToken } from '@utils/api';
import { formatWsData } from '@utils/format';

import type { Middleware, MiddlewareAPI, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@services/store';
import type { TOrdersResponseDto, TWSActions } from '@utils/types';

let ws: WebSocket | null = null;
let isConnected = false; // Флаг: считается ли пользователь подключённым?
const reconnectPeriod = 3000;
let currentUrl = '';
let reconnectTimerId = 0;

const socketMiddleware = (
  withTokenRefresh: boolean,
  sliceName: string,
  sliceActions: TWSActions
): Middleware => {
  return (store: MiddlewareAPI<AppDispatch, RootState>) =>
    (next) =>
    (action: PayloadAction) => {
      // console.log('[ws mw]', { store, next, action });
      const { type } = action;

      if (type === `${sliceName}/connect`) {
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

          store.dispatch(sliceActions.onOpen());
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

                    store.dispatch(sliceActions.connect(wssUrl.toString()));
                  })
                  .catch((error: unknown) => {
                    console.log({ error });
                    store.dispatch(sliceActions.onError('Не удалось обновить токен'));
                  });

                store.dispatch(sliceActions.disconnect());
                return;
              }

              const ingredients = store.getState()?.ingredients?.ingredients;
              store.dispatch(
                sliceActions.onMessage({
                  orders: formatWsData(wsDataResponse.orders, ingredients),
                  total: wsDataResponse.total,
                  totalToday: wsDataResponse.totalToday,
                })
              );
            }
          } catch (error: unknown) {
            console.log({ error });
            store.dispatch(sliceActions.onError('Ошибка парсинга сообщения от сервера'));
          }
        };

        // Обработчик ошибок
        ws.onerror = (): void => {
          store.dispatch(sliceActions.onError('Ошибка WebSocket-соединения'));
        };

        // Обработчик закрытия соединения
        ws.onclose = (): void => {
          store.dispatch(sliceActions.onClose());
          ws = null;

          if (isConnected) {
            reconnectTimerId = setTimeout(() => {
              store.dispatch(sliceActions.connect(currentUrl));
            }, reconnectPeriod);
          }
        };
      }

      // Обработка экшена disconnect
      if (type === `${sliceName}/disconnect`) {
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
