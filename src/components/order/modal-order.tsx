import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { Order } from '@components/order/order';
import { modalDealSlice, selectModalDeal } from '@services/slices/modal-deal-slice';
import { useAppDispatch, useAppSelector } from '@services/store';

import type { JSX } from 'react';

const target = {
  name: 'Some name',
  date: '2026-07-11T07:43:22.603Z',
  number: 123,
  price: 11908,
  ingredients: [
    {
      _id: '692889f16bf770001bfeb4cc',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
    {
      _id: '692889f16bf770001bfeb4d8',
      name: 'Кристаллы марсианских альфа-сахаридов',
      type: 'main',
      proteins: 234,
      fat: 432,
      carbohydrates: 111,
      calories: 189,
      price: 762,
      image: 'https://code.s3.yandex.net/react/code/core.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/core-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/core-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
    {
      _id: '692889f16bf770001bfeb4da',
      name: 'Сыр с астероидной плесенью',
      type: 'main',
      proteins: 84,
      fat: 48,
      carbohydrates: 420,
      calories: 3377,
      price: 4142,
      image: 'https://code.s3.yandex.net/react/code/cheese.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/cheese-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/cheese-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
    {
      _id: '692889f16bf770001bfeb4cf',
      name: 'Мясо бессмертных моллюсков Protostomia',
      type: 'main',
      proteins: 433,
      fat: 244,
      carbohydrates: 33,
      calories: 420,
      price: 1337,
      image: 'https://code.s3.yandex.net/react/code/meat-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
    {
      _id: '692889f16bf770001bfeb4cd',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
    {
      _id: '692889f16bf770001bfeb4d3',
      name: 'Соус фирменный Space Sauce',
      type: 'sauce',
      proteins: 50,
      fat: 22,
      carbohydrates: 11,
      calories: 14,
      price: 80,
      image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
    {
      _id: '692889f16bf770001bfeb4d3',
      name: 'Соус фирменный Space Sauce',
      type: 'sauce',
      proteins: 50,
      fat: 22,
      carbohydrates: 11,
      calories: 14,
      price: 80,
      image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
    {
      _id: '692889f16bf770001bfeb4d0',
      name: 'Говяжий метеорит (отбивная)',
      type: 'main',
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: 'https://code.s3.yandex.net/react/code/meat-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
    {
      _id: '692889f16bf770001bfeb4d5',
      name: 'Соус с шипами Антарианского плоскоходца',
      type: 'sauce',
      proteins: 101,
      fat: 99,
      carbohydrates: 100,
      calories: 100,
      price: 88,
      image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
    {
      _id: '692889f16bf770001bfeb4d5',
      name: 'Соус с шипами Антарианского плоскоходца',
      type: 'sauce',
      proteins: 101,
      fat: 99,
      carbohydrates: 100,
      calories: 100,
      price: 88,
      image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
    {
      _id: '692889f16bf770001bfeb4d5',
      name: 'Соус с шипами Антарианского плоскоходца',
      type: 'sauce',
      proteins: 101,
      fat: 99,
      carbohydrates: 100,
      calories: 100,
      price: 88,
      image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
      __v: 0,
      nanoid: '',
      counter: 0,
    },
  ],
};

export const ModalOrder = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const params = useParams();
  const location = useLocation();
  const order = useAppSelector(selectModalDeal);
  // const ingredients = useAppSelector(selectIngredients);

  const backUrl = location.pathname.includes('profile/orders')
    ? '/profile/orders'
    : '/feed';

  const handleCloseModal = (): void => {
    dispatch(modalDealSlice.actions.setModalDealData(null));
    // TODO проверить, мы на странице feed или profile/orders
    void navigate(backUrl);
  };

  useEffect(() => {
    if (order) {
      return;
    }

    if (!order?.id) {
      // TODO проверить, мы на странице feed или profile/orders
      void navigate(backUrl);
      return;
    }

    if (!order) {
      return;
    }
    // если пользователь перешел на страницу /ingredients/:id и обновил страницу, то
    // у нас не будет ingredients и ingredient в store, но в адресной строке останется id ингредиента,
    // поскольку модальное окно это outlet в HomePage, то при обновлении запросятся ingredients
    // получаем ingredients, после чего по id находим целевой ingredient
    // const { bun, main, sauce } = ingredients;
    // const target = [...bun, ...main, ...sauce].find((el) => el._id === params.id);

    if (target) {
      dispatch(modalDealSlice.actions.setModalDealData(target));
    } else {
      // TODO проверить, мы на странице feed или profile/orders
      void navigate(backUrl);
    }
  }, [order]); // TODO сейчас при обновлении order не меняется, поэтому модальное окно закроется, будет редирект

  return (
    <>
      {order ? (
        <Modal
          title={`#${order.number}`}
          titleTypography="text_type_digits-medium"
          onClose={handleCloseModal}
        >
          <Order order={order} />
        </Modal>
      ) : null}
    </>
  );
};
