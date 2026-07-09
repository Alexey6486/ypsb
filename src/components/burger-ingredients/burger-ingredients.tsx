import { Tab, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { BurgerIngredientsBlock } from '@components/burger-ingredients/block/burger-ingredients-block';
import { BurgerIngredientsList } from '@components/burger-ingredients/list/burger-ingredients-list';
import { selectIngredients, selectIsLoading } from '@services/slices/ingredients-slice';
import { modalIngredientSlice } from '@services/slices/modal-ingredient-slice';
import { useAppDispatch, useAppSelector } from '@services/store';
import { INGREDIENTS } from '@utils/constants';

import type { TIngredientUI, TIngredientType } from '@utils/types';
import type { RefObject, JSX } from 'react';

import styles from './burger-ingredients.module.css';

const BUN = 'Булки';
const MAIN = 'Начинки';
const SAUCE = 'Соусы';

export const BurgerIngredients = (): JSX.Element => {
  const navigate = useNavigate();
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIsLoading);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const sauceRef = useRef<HTMLDivElement | null>(null);

  const containerRef: RefObject<HTMLDivElement | null> = useRef(null);

  const [tab, setTab] = useState<TIngredientType>(INGREDIENTS.BUN);
  const dispatch = useAppDispatch();

  const handleOpenModal = (ingredient: TIngredientUI): void => {
    dispatch(modalIngredientSlice.actions.setModalIngredientData(ingredient));
    void navigate(`/ingredients/${ingredient._id}`);
  };

  useEffect(() => {
    const container = containerRef.current;
    const main = mainRef.current;
    const sauce = sauceRef.current;

    if (!container || !main || !sauce) return;

    const handleTabChange = (): void => {
      if (
        !('getBoundingClientRect' in main) ||
        !('getBoundingClientRect' in sauce) ||
        !('getBoundingClientRect' in container)
      ) {
        return;
      }

      const { top: mainTop } = main.getBoundingClientRect();
      const { top: sauceTop } = sauce.getBoundingClientRect();
      const { top: containerTop } = container.getBoundingClientRect();

      if (mainTop < containerTop && sauceTop > containerTop) {
        setTab((prev) => (prev !== INGREDIENTS.MAIN ? INGREDIENTS.MAIN : prev));
      } else if (sauceTop < containerTop) {
        setTab((prev) => (prev !== INGREDIENTS.SAUCE ? INGREDIENTS.SAUCE : prev));
      } else {
        setTab((prev) => (prev !== INGREDIENTS.BUN ? INGREDIENTS.BUN : prev));
      }
    };

    if (container) {
      container.addEventListener('scroll', handleTabChange);
    }

    return (): void => {
      if (container) {
        container.removeEventListener('scroll', handleTabChange);
      }
    };
  }, [ingredients]);

  return (
    <>
      <section className={`${styles.burger_ingredients} mb-10`}>
        <nav>
          <ul className={styles.menu}>
            <Tab
              value={INGREDIENTS.BUN}
              active={tab === INGREDIENTS.BUN}
              onClick={() => {
                /* TODO */
              }}
            >
              {BUN}
            </Tab>
            <Tab
              value={INGREDIENTS.MAIN}
              active={tab === INGREDIENTS.MAIN}
              onClick={() => {
                /* TODO */
              }}
            >
              {MAIN}
            </Tab>
            <Tab
              value={INGREDIENTS.SAUCE}
              active={tab === INGREDIENTS.SAUCE}
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
          <div
            className={`${styles.burger_ingredients_container} custom-scroll`}
            ref={containerRef}
          >
            <BurgerIngredientsBlock title={BUN}>
              <BurgerIngredientsList list={ingredients.bun} onClick={handleOpenModal} />
            </BurgerIngredientsBlock>
            <BurgerIngredientsBlock title={MAIN} ref={mainRef}>
              <BurgerIngredientsList list={ingredients.main} onClick={handleOpenModal} />
            </BurgerIngredientsBlock>
            <BurgerIngredientsBlock title={SAUCE} ref={sauceRef}>
              <BurgerIngredientsList
                list={ingredients.sauce}
                onClick={handleOpenModal}
              />
            </BurgerIngredientsBlock>
          </div>
        )}
      </section>
      <Outlet />
    </>
  );
};
