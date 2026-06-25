import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-ingredient-card.module.css';

type TProps = {
  data: TIngredient;
  counter: number;
  onClick: () => null;
};

export const BurgerIngredientCard = ({
  data,
  counter = 0,
  onClick,
}: TProps): JSX.Element => {
  const { name, price, image } = data;

  return (
    <div className={`${styles.burger_ingredient_card} mb-8`} onClick={onClick}>
      {counter > 0 && <Counter count={counter} size="default" />}
      <div className="pl-4 pr-4">
        <img src={image} alt="ingredient" />
        <div className={`${styles.burger_ingredient_price} mt-1 mb-2`}>
          <p className="mr-2 text text_type_digits-default">{price}</p>
          <CurrencyIcon type="primary" />
        </div>
      </div>
      <p className={`${styles.burger_ingredient_name} text text_type_main-default`}>
        {name}
      </p>
    </div>
  );
};
