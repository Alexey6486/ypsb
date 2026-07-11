import { useEffect, useState } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { selectIngredients } from '@services/slices/ingredients-slice';
import { useAppSelector } from '@services/store';

import type { TIngredientUI, TOrderCardUI } from '@utils/types';
import type { JSX } from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrdersPage = (): JSX.Element => {
  // const orders = useAppSelector(selectOrdersFeed);

  const ingredients = useAppSelector(selectIngredients);
  const [state, setState] = useState<TOrderCardUI[]>([]); // TODO перенести в selectOrdersFeed

  const orders = [
    {
      ingredients: [
        '692889f16bf770001bfeb4cc',
        '692889f16bf770001bfeb4d8',
        '692889f16bf770001bfeb4da',
        '692889f16bf770001bfeb4cf',
        '692889f16bf770001bfeb4cd',
        '692889f16bf770001bfeb4d3',
        '692889f16bf770001bfeb4d0',
        '692889f16bf770001bfeb4d5',
      ],
      _id: '1',
      name: 'Some name', // TODO проверь есть ли в ответе имя заказа, если нет, где брать
      status: 'done',
      number: 123,
      createdAt: '2021-06-23T14:43:22.587Z',
      updatedAt: '2026-07-11T07:43:22.603Z',
    },
    {
      ingredients: [
        '692889f16bf770001bfeb4cc',
        '692889f16bf770001bfeb4d8',
        '692889f16bf770001bfeb4da',
        '692889f16bf770001bfeb4cf',
      ],
      _id: '2',
      name: 'Some name',
      status: 'pending',
      number: 142,
      createdAt: '2021-06-23T14:43:22.587Z',
      updatedAt: '2026-07-10T14:43:22.603Z',
    },
    {
      ingredients: [
        '692889f16bf770001bfeb4cc',
        '692889f16bf770001bfeb4d8',
        '692889f16bf770001bfeb4da',
        '692889f16bf770001bfeb4cf',
        '692889f16bf770001bfeb4cd',
        '692889f16bf770001bfeb4d3',
        '692889f16bf770001bfeb4d0',
      ],
      _id: '3',
      name: 'Some name',
      status: 'pending',
      number: 2345,
      createdAt: '2021-06-23T14:43:22.587Z',
      updatedAt: '2026-07-09T14:43:22.603Z',
    },
    {
      ingredients: [
        '692889f16bf770001bfeb4cc',
        '692889f16bf770001bfeb4d8',
        '692889f16bf770001bfeb4da',
        '692889f16bf770001bfeb4cf',
        '692889f16bf770001bfeb4cd',
        '692889f16bf770001bfeb4d3',
      ],
      _id: '4',
      name: 'Some name',
      status: 'done',
      number: 634,
      createdAt: '2021-06-23T14:43:22.587Z',
      updatedAt: '2026-07-08T14:43:22.603Z',
    },
    {
      ingredients: [
        '692889f16bf770001bfeb4cc',
        '692889f16bf770001bfeb4d8',
        '692889f16bf770001bfeb4da',
        '692889f16bf770001bfeb4cf',
        '692889f16bf770001bfeb4cd',
        '692889f16bf770001bfeb4d3',
        '692889f16bf770001bfeb4d0',
        '692889f16bf770001bfeb4d5',
      ],
      _id: '5',
      name: 'Some name',
      status: 'created',
      number: 747,
      createdAt: '2021-06-23T14:43:22.587Z',
      updatedAt: '2026-07-08T14:43:22.603Z',
    },
    {
      ingredients: ['692889f16bf77000', '692889f16bf77000', '692889f16bf77000'],
      _id: '7',
      name: '',
      status: 'done',
      number: 867,
      createdAt: '2021-06-23T14:43:22.587Z',
      updatedAt: '2021-06-23T14:43:22.603Z',
    },
  ];

  useEffect(() => {
    // TODO перенести в selectOrdersFeed, вынести выше, в компоненту feed
    if (ingredients) {
      const orderList = orders
        .map(({ ingredients: ids, number, status, name, updatedAt }) => {
          const images = [];
          let price = 0;
          const test = [...ingredients.bun, ...ingredients.main, ...ingredients.sauce];
          console.log({ test });
          ids.forEach((id) => {
            const target: TIngredientUI | null = test.find((ing) => {
              console.log({ ingredients, ing: ing._id, id, check: ing._id === id });
              return ing._id === id;
            });
            if (target) {
              images.push(target.image_mobile);
              price += target.price;
            }
          });

          if (price > 0) {
            return {
              name: name ?? 'Some name',
              date: updatedAt,
              number,
              status,
              price,
              images,
            };
          }

          return null;
        })
        .filter((el) => el !== null);

      console.log({ orderList });
      setState(orderList);
    }
  }, [ingredients]);

  return (
    <div className={`${styles.container} pr-2`}>
      {state.map((el) => (
        <OrderCard key={el.number} data={el} />
      ))}
    </div>
  );
};
