import { describe, it, expect } from 'vitest';

import { formatWsData } from '@utils/format';

import type {
  TIngredientsSorted,
  TOrderDto,
  TIngredientUI,
  TOrderCardUI,
  TNullable,
} from '@utils/types';

describe('Функция formatWsData', () => {
  it('при передаче в функцию некорректных параметров, функция должна возвращать пустой массив', () => {
    // 1. Arrange: Готовим входные данные
    const orders: TOrderDto[] = [undefined];
    const ingredients: TNullable<TIngredientsSorted> = null;

    // 2. Act: Запускаем функцию
    const result: TOrderCardUI[] = formatWsData(orders, ingredients);

    // 3. Assert: Проверяем результат
    expect(result).length(0);
  });

  it('функция должна вернуть заказ, заменив id ингредиента, на соответствующий объект ингредиента', () => {
    // 1. Arrange: Готовим входные данные
    const ING_ID = 'ingredient_id';
    const ORD_ID = 'order_id';

    const orders: TOrderDto[] = [
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

    const ingredient: TIngredientUI = {
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
      nanoid: 'string',
      counter: 1,
    };

    const ingredients: TIngredientsSorted = {
      bun: [ingredient],
      main: [],
      sauce: [],
    };

    const res: TOrderCardUI = {
      id: ORD_ID,
      name: 'order_name',
      date: 'string',
      number: 1,
      status: 'done',
      price: 5,
      ingredients: [ingredient],
    };

    // 2. Act: Запускаем функцию
    const result = formatWsData(orders, ingredients);

    // 3. Assert: Проверяем результат
    expect(result).length(1);
    expect(result).toEqual([res]);
  });
});
