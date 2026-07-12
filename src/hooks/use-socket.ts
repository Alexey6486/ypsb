import { useCallback, useEffect, useRef } from 'react';

export const CONNECTING = 'CONNECTING' as const;
export const OPEN = 'OPEN' as const;
export const CLOSING = 'CLOSING' as const;
export const CLOSED = 'CLOSED' as const;

export const socketStates = {
  [WebSocket.CONNECTING]: CONNECTING,
  [WebSocket.OPEN]: OPEN,
  [WebSocket.CLOSING]: CLOSING,
  [WebSocket.CLOSED]: CLOSED,
} as const;

type IWSOptions = {
  onMessage: (event: MessageEvent<string>) => void;
  onConnect?: (event: Event) => void;
  onError?: (event: Event) => void;
  onDisconnect?: (event: Event) => void;
};

type UseSocketReturn = {
  connect: (token: string) => void;
  sendData: (data: { message: string; token: string }) => void;
};

export const useSocket = (url: string, options: IWSOptions): UseSocketReturn => {
  const ws = useRef<WebSocket | null>(null);

  const connect = useCallback(
    (token: string) => {
      ws.current = new WebSocket(`${url}?token=${token}`);

      ws.current.onmessage = options.onMessage;

      ws.current.onopen = (event: Event): void => {
        if (typeof options.onConnect === 'function') {
          options.onConnect(event);
        }
      };

      ws.current.onerror = (event: Event): void => {
        if (typeof options.onError === 'function') {
          options.onError(event);
        }
      };

      ws.current.onclose = (event: Event): void => {
        if (typeof options.onDisconnect === 'function') {
          options.onDisconnect(event);
        }
      };
    },
    [url, options]
  );

  useEffect(() => {
    if (ws.current) {
      ws.current.onmessage = options.onMessage;

      if (typeof options.onConnect === 'function') {
        ws.current.onopen = options.onConnect;
      }
      if (typeof options.onError === 'function') {
        ws.current.onerror = options.onError;
      }
      if (typeof options.onDisconnect === 'function') {
        ws.current.onclose = options.onDisconnect;
      }
    }
  }, [options, ws]);

  useEffect(() => {
    return (): void => {
      if (ws.current && typeof ws.current.close === 'function') {
        ws.current.close();
      }
    };
  }, []);

  const sendData = useCallback(
    (message: object) => {
      if (ws.current) {
        ws.current.send(JSON.stringify(message));
      }
    },
    [ws]
  );

  return { connect, sendData };
};
