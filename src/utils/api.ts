import { TOKEN, URLS } from '@utils/constants';

import type { TRefreshTokenResponse } from '@utils/types';

export const BASE_URL = 'https://norma.education-services.ru/api/';
export const BASE_AUTH_URL = 'https://new-stellarburgers.education-services.ru/api/';

export const defaultRequestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const checkResponse = <T>(res: Response): Promise<T> => {
  if (res?.ok) {
    return res.json();
  }
  const error = new Error(`Ошибка ${res.status}`);

  return Promise.reject(error);
};

const checkSuccess = <T>(res: T): Promise<T> | T => {
  if (res?.success) {
    return res;
  }

  const error = new Error('Ответ не success');

  return Promise.reject(error);
};

export const request = <T>(
  endpoint: string,
  options?: RequestInit,
  isAuth?: boolean
): Promise<T> => {
  return fetch(`${isAuth ? BASE_AUTH_URL : BASE_URL}${endpoint}`, options)
    .then(checkResponse)
    .then(checkSuccess);
};

export async function refreshToken(): Promise<TRefreshTokenResponse> {
  const token = localStorage.getItem(TOKEN.REFRESH);

  const response: TRefreshTokenResponse = await request(
    URLS.REFRESH_TOKEN,
    {
      body: JSON.stringify({ token }),
    },
    true
  );

  localStorage.setItem(TOKEN.ACCESS, response.accessToken);
  localStorage.setItem(TOKEN.REFRESH, response.refreshToken);

  return response;
}

export async function fetchWithRefresh<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  try {
    return await request(endpoint, options, true);
  } catch (error: unknown) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      const refreshData = await refreshToken();
      const headers = new Headers(options?.headers);
      headers.set('authorization', refreshData.accessToken);

      return request(
        endpoint,
        {
          ...options,
          headers,
        },
        true
      );
    } else {
      throw error;
    }
  }
}
