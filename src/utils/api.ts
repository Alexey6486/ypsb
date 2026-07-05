export const BASE_URL = 'https://norma.education-services.ru/api/';

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

export const request = <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  return fetch(`${BASE_URL}${endpoint}`, options).then(checkResponse).then(checkSuccess);
};
