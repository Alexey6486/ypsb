import type {
  TIngredientUI,
  TOrderDto,
  TOrderCardUI,
  TNullable,
  TIngredientsSorted,
} from '@utils/types';

export const formatWsData = (
  orders: TOrderDto[],
  ingredients?: TNullable<TIngredientsSorted>
): TOrderCardUI[] => {
  if (!ingredients || !orders?.length) {
    return [];
  }

  const result: TOrderCardUI[] = [];

  orders.forEach(({ ingredients: ids, number, name, updatedAt, _id, status }) => {
    const ingredientsList: TIngredientUI[] = [];
    let price = 0;
    const list = [...ingredients.bun, ...ingredients.main, ...ingredients.sauce];

    ids.forEach((id) => {
      const target: TIngredientUI | undefined = list.find((ing) => {
        return ing._id === id;
      });

      if (target) {
        ingredientsList.push(target);
        price += target.price;
      }
    });

    if (price > 0) {
      result.push({
        id: _id,
        name,
        date: updatedAt,
        number,
        status,
        price,
        ingredients: ingredientsList,
      });
    }
  });

  return result;
};
