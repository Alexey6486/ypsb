import { Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import { Price } from '@components/price/price';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-ingredient-card.module.css';

type TProps = {
  data: TIngredient;
  counter: number;
  onClick: (ingredietn: TIngredient) => void;
};

// нужно будет использовать memo, чтобы при изменении counter, перерисовывать только целевые компоненты
export const BurgerIngredientCard = ({
  data,
  counter = 0,
  onClick,
}: TProps): JSX.Element => {
  const { name, price, image } = data;
  const [{ isDrag }, dragRef] = useDrag({
    type: 'ingredient',
    item: { ingredient: data },
    collect: (monitor) => ({
      isDrag: monitor.isDragging(),
    }),
  });

  const handleClick = (): void => {
    onClick(data);
  };

  return !isDrag ? (
    <div
      className={`${styles.burger_ingredient_card} mb-8`}
      onClick={handleClick}
      ref={dragRef}
    >
      {counter > 0 && <Counter count={counter} size="default" />}
      <div className="pl-4 pr-4">
        <img src={image} alt="ingredient-image" />
        <div className="mt-1 mb-2">
          <Price
            price={price}
            typographyClass="text_type_digits-default"
            iconSize="small"
          />
        </div>
      </div>
      <p className={`${styles.burger_ingredient_name} text text_type_main-default`}>
        {name}
      </p>
    </div>
  ) : (
    <></>
  );
};
