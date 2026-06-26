import { Tab } from '@krgaa/react-developer-burger-ui-components';

import { BurgerIngredientsBlock } from '@components/burger-ingredients/block/burger-ingredients-block';
import { BurgerIngredientsList } from '@components/burger-ingredients/list/burger-ingredients-list';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

const BUN = 'Булки';
const MAIN = 'Начинки';
const SAUCE = 'Соусы';

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): JSX.Element => {
  console.log(ingredients);

  const { bun, main, sauce } = ingredients.reduce(
    (acc, item) => {
      return { ...acc, [item.type]: [...acc[item.type], item] };
    },
    { bun: [], main: [], sauce: [] }
  );

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
      <div className={`${styles.burger_ingredients_container} custom-scroll`}>
        <BurgerIngredientsBlock title={BUN}>
          <BurgerIngredientsList list={bun} />
        </BurgerIngredientsBlock>
        <BurgerIngredientsBlock title={MAIN}>
          <BurgerIngredientsList list={main} />
        </BurgerIngredientsBlock>
        <BurgerIngredientsBlock title={SAUCE}>
          <BurgerIngredientsList list={sauce} />
        </BurgerIngredientsBlock>
      </div>
    </section>
  );
};
