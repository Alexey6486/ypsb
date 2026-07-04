import type { TIngredientUI } from '@utils/types';
import type { JSX } from 'react';

import styles from './ingredient-details.module.css';

type TProps = {
  ingredient: TIngredientUI;
};

export const IngredientDetails = ({ ingredient }: TProps): JSX.Element => {
  const { image_large, name, calories, proteins, fat, carbohydrates } = ingredient;
  return (
    <div className={styles.ingredient_details_container}>
      <img className="mb-4" src={image_large} alt="ingredient-image" />
      <p className="text text_type_main-medium mb-8">{name}</p>
      <div className={`${styles.ingredient_details_elements} mb-5`}>
        <div>
          <p className="text text_type_main-default text_color_inactive">Калории,ккал</p>
          <p className="text text_type_digits-default text_color_inactive">{calories}</p>
        </div>
        <div>
          <p className="text text_type_main-default text_color_inactive">Белки, г</p>
          <p className="text text_type_digits-default text_color_inactive">{proteins}</p>
        </div>
        <div>
          <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
          <p className="text text_type_digits-default text_color_inactive">{fat}</p>
        </div>
        <div>
          <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {carbohydrates}
          </p>
        </div>
      </div>
    </div>
  );
};
