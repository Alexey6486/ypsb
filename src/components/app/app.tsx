import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { GET_INGREDIENTS_URL } from '@utils/constants';

import type { TIngredient, TAppState } from '@utils/types';
import type { JSX } from 'react';

import styles from './app.module.css';

export const App = (): JSX.Element => {
  const [state, setState] = useState<TAppState>({
    ingredients: null,
    order: null,
    isLoading: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(GET_INGREDIENTS_URL, { signal })
      .then((res): Promise<{ data: TIngredient[]; success: boolean }> => {
        if (!res.ok) {
          throw Error('Ошибка запроса');
        }

        return res.json();
      })
      .then((jsonRes): void => {
        if (!jsonRes.success) {
          throw Error('Ошибка запроса');
        }

        const { bun, main, sauce } = jsonRes.data.reduce(
          (acc, item) => {
            return { ...acc, [item.type]: [...acc[item.type], item] };
          },
          { bun: [], main: [], sauce: [] }
        );

        setState({
          ingredients: { bun, main, sauce },
          order: jsonRes.data,
          isLoading: false,
        });
      })
      .catch((error: unknown): void => {
        console.log({ error });

        setState({ ingredients: null, order: null, isLoading: false });
      });

    return (): void => {
      controller.abort();
    };
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={state.ingredients} isLoading={state.isLoading} />
        <BurgerConstructor ingredients={state.order} />
      </main>
    </div>
  );
};

export default App;
