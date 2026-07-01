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
  const dispatch: AppDispatch = useDispatch();
  const { ingredients, order, isLoading } = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchIngredientsThunk() as undefined);
    // если здесь убрать undefined, то сначала начинает душить линт:
    // Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator  @typescript-eslint/no-floating-promises
    // а затем и TS:
    // ошибка TS Argument type AsyncThunkAction<{bun: any[], main: any[], sauce: any[]}, void, AsyncThunkConfig> is not assignable to parameter type UnknownAction
    // разобраться с этим не удалось, в предыдущем проекте точно такая же настройка стора, никаких ошибок
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
