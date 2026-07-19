import { describe, it, expect } from 'vitest';

import { ingredients_test, order_card_test, orders_list_test } from '@utils/constants';
import { formatWsData } from '@utils/format';

import type {
  TIngredientsSorted,
  TOrderDto,
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
    // 2. Act: Запускаем функцию
    const result = formatWsData(orders_list_test, ingredients_test);

    // 3. Assert: Проверяем результат
    expect(result).length(1);
    expect(result).toEqual([order_card_test]);
  });
});
