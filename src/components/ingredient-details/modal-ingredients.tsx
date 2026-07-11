import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { selectIngredients } from '@services/slices/ingredients-slice';
import {
  selectModalIngredient,
  modalIngredientSlice,
} from '@services/slices/modal-ingredient-slice';
import { useAppDispatch, useAppSelector } from '@services/store';

import type { JSX } from 'react';

export const ModalIngredients = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const ingredient = useAppSelector(selectModalIngredient);
  const ingredients = useAppSelector(selectIngredients);

  const handleCloseModal = (): void => {
    dispatch(modalIngredientSlice.actions.setModalIngredientData(null));
    void navigate(`/`);
  };

  useEffect(() => {
    if (ingredient) {
      return;
    }

    if (!params?.id) {
      void navigate(`/`);
      return;
    }

    if (!ingredients) {
      return;
    }
    // если пользователь перешел на страницу /ingredients/:id и обновил страницу, то
    // у нас не будет ingredients и ingredient в store, но в адресной строке останется id ингредиента,
    // поскольку модальное окно это outlet в HomePage, то при обновлении запросятся ingredients
    // получаем ingredients, после чего по id находим целевой ingredient
    const { bun, main, sauce } = ingredients;
    const target = [...bun, ...main, ...sauce].find((el) => el._id === params.id);

    if (target) {
      dispatch(modalIngredientSlice.actions.setModalIngredientData(target));
    } else {
      void navigate(`/`);
    }
  }, [ingredients]);

  return (
    <>
      {ingredient ? (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={ingredient} />
        </Modal>
      ) : null}
    </>
  );
};
