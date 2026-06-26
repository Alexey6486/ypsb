import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { GET_INGREDIENTS_URL } from '@utils/constants';

import type { TIngredient, TAppState, TModalType } from '@utils/types';
import type { JSX } from 'react';

import styles from './app.module.css';

export const App = (): JSX.Element => {
  const [modalState, setModalState] = useState<{
    type: TModalType | null;
    isOpened: boolean;
  }>({ type: null, isOpened: false });
  const [state, setState] = useState<TAppState>({
    ingredients: null,
    order: null,
    isLoading: true,
  });

  const handleOpenModal = (type: TModalType): void => {
    setModalState({ type: type, isOpened: true });
  };

  const handleCloseModal = (): void => {
    setModalState({ type: null, isOpened: false });
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(GET_INGREDIENTS_URL, { signal })
      .then((res): Promise<{ data: TIngredient[] }> => res.json())
      .then(({ data }): void => {
        const { bun, main, sauce } = data.reduce(
          (acc, item) => {
            return { ...acc, [item.type]: [...acc[item.type], item] };
          },
          { bun: [], main: [], sauce: [] }
        );
        setState({ ingredients: { bun, main, sauce }, order: data, isLoading: false });
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
        <BurgerConstructor ingredients={state.order} onOpenModal={handleOpenModal} />
      </main>
      <Modal
        type={modalState.type}
        onClose={handleCloseModal}
        isOpened={modalState.isOpened}
      />
    </div>
  );
};

export default App;
