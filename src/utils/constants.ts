import type {
  TIngredientsSorted,
  TIngredientUI,
  TOrderCardUI,
  TOrderDto,
  TOrderStatusType,
  TIngredientType,
} from '@utils/types';

export const URLS = {
  GET_INGREDIENTS: 'ingredients',
  POST_ORDER: 'orders',
  LOGIN: 'auth/login',
  GET_USER: 'auth/user',
  REGISTER: 'auth/register',
  REFRESH_TOKEN: 'auth/token',
  LOGOUT: 'auth/logout',
  FORGOT_PSW: 'password-reset',
  RESET_PSW: 'password-reset/reset',
} as const;

export const INGREDIENTS: Record<string, TIngredientType> = {
  BUN: 'bun',
  MAIN: 'main',
  SAUCE: 'sauce',
} as const;

export const TOKEN = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
} as const;

export const ORDER_STATUS_TEXT: Record<TOrderStatusType, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан',
} as const;

const ING_ID = 'ingredient_id';
const ORD_ID = 'order_id';

export const orders_list_test: TOrderDto[] = [
  {
    ingredients: [ING_ID],
    _id: ORD_ID,
    status: 'done',
    number: 1,
    name: 'order_name',
    createdAt: 'string',
    updatedAt: 'string',
  },
];

export const ingredient_test: TIngredientUI = {
  _id: ING_ID,
  name: 'ingredient_name',
  type: 'bun',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 5,
  image: 'string',
  image_large: 'string',
  image_mobile: 'string',
  __v: 1,
  nanoid: '1',
  counter: 1,
};

export const ingredient_main_test: TIngredientUI = {
  _id: '2',
  name: 'ingredient_name',
  type: 'main',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 5,
  image: 'string',
  image_large: 'string',
  image_mobile: 'string',
  __v: 1,
  nanoid: '2',
  counter: 1,
};

export const ingredients_test: TIngredientsSorted = {
  bun: [ingredient_test],
  main: [ingredient_main_test],
  sauce: [],
};

export const order_card_test: TOrderCardUI = {
  id: ORD_ID,
  name: 'order_name',
  date: 'string',
  number: 1,
  status: 'done',
  price: 5,
  ingredients: [ingredient_test],
};
