import { Tab, Preloader } from '@krgaa/react-developer-burger-ui-components';

import { BurgerIngredientsBlock } from '@components/burger-ingredients/block/burger-ingredients-block';
import { BurgerIngredientsList } from '@components/burger-ingredients/list/burger-ingredients-list';

import type { TIngredientsSorted } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredientsSorted | null;
  isLoading: boolean;
};

const BUN = 'Булки';
const MAIN = 'Начинки';
const SAUCE = 'Соусы';

export const BurgerIngredients = ({
  ingredients,
  isLoading,
}: TBurgerIngredientsProps): JSX.Element => {
  return (
    <section className={`${styles.burger_ingredients} mb-10`}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={true}
            onClick={() => {
              /* TODO */
            }}
          >
            {BUN}
          </Tab>
          <Tab
            value="main"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            {MAIN}
          </Tab>
          <Tab
            value="sauce"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            {SAUCE}
          </Tab>
        </ul>
      </nav>
      {isLoading && <Preloader />}
      {!isLoading && ingredients && (
        <div className={`${styles.burger_ingredients_container} custom-scroll`}>
          <BurgerIngredientsBlock title={BUN}>
            <BurgerIngredientsList list={ingredients.bun} />
          </BurgerIngredientsBlock>
          <BurgerIngredientsBlock title={MAIN}>
            <BurgerIngredientsList list={ingredients.main} />
          </BurgerIngredientsBlock>
          <BurgerIngredientsBlock title={SAUCE}>
            <BurgerIngredientsList list={ingredients.sauce} />
          </BurgerIngredientsBlock>
        </div>
      )}
    </section>
  );
};
