import { BurgerIngredientCard } from '@components/burger-ingredients/card/burger-ingredient-card';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-ingredients-list.module.css';

type TProps = {
  list: TIngredient[];
};

export const BurgerIngredientsList = ({ list }: TProps): JSX.Element => {
  return (
    <div className={`${styles.burger_ingredients_list} pt-6 pl-4 pr-4`}>
      {list.map((el) => (
        <BurgerIngredientCard key={el._id} data={el} onClick={() => null} counter={0} />
      ))}
    </div>
  );
};
