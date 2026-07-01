import { useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { fetchIngredientsThunk, selectIngredients } from '@services/ingredients/slices';
import { useDispatch, useSelector } from '@services/store';

import type { AppDispatch } from '@services/store';
import type { JSX } from 'react';

import styles from './app.module.css';

export const App = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { ingredients, order, isLoading } = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchIngredientsThunk());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={ingredients} isLoading={isLoading} />
        <BurgerConstructor ingredients={order} />
      </main>
    </div>
  );
};

export default App;
