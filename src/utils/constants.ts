import type { TIngredientType } from '@utils/types';

export const URLS = {
  GET_INGREDIENTS: 'ingredients',
  POST_ORDER: 'orders',
  LOGIN: 'auth/login',
  GET_USER: 'auth/user',
} as const;

export const INGREDIENTS: Record<string, TIngredientType> = {
  BUN: 'bun',
  MAIN: 'main',
  SAUCE: 'sauce',
} as const;
