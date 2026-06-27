import { Tab, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { BurgerIngredientsBlock } from '@components/burger-ingredients/block/burger-ingredients-block';
import { BurgerIngredientsList } from '@components/burger-ingredients/list/burger-ingredients-list';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

import type { TIngredient, TIngredientsSorted } from '@utils/types';
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
  const [modalState, setModalState] = useState<{
    isVisible: boolean;
    ingredient: TIngredient | null;
  }>({ isVisible: false, ingredient: null });

  console.log('BurgerIngredients render');

  const handleOpenModal = (ingredient: TIngredient): void => {
    setModalState({ isVisible: true, ingredient: ingredient });
  };

  const handleCloseModal = (): void => {
    setModalState({ isVisible: false, ingredient: null });
  };

  return (
    <>
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
              <BurgerIngredientsList list={ingredients.bun} onClick={handleOpenModal} />
            </BurgerIngredientsBlock>
            <BurgerIngredientsBlock title={MAIN}>
              <BurgerIngredientsList list={ingredients.main} onClick={handleOpenModal} />
            </BurgerIngredientsBlock>
            <BurgerIngredientsBlock title={SAUCE}>
              <BurgerIngredientsList
                list={ingredients.sauce}
                onClick={handleOpenModal}
              />
            </BurgerIngredientsBlock>
          </div>
        )}
      </section>
      {modalState.isVisible && modalState.ingredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={modalState.ingredient} />
        </Modal>
      )}
    </>
  );
};
