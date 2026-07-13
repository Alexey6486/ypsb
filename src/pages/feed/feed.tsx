import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { FeedDetails } from '@components/feed-details/feed-details';
import { OrdersFeed } from '@components/orders-feed/orders-feed';
import { feedWsSlice } from '@services/slices/feed-ws-slice';
import { useAppDispatch } from '@services/store';
import { BASE_WS_URL } from '@utils/api';

import type { JSX } from 'react';

import styles from './feed.module.css';

export const FeedPage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('render');
    void dispatch(feedWsSlice.actions.connect(`${BASE_WS_URL}/all`));

    return (): void => {
      void dispatch(feedWsSlice.actions.disconnect());
    };
  }, []);

  return (
    <>
      <main className={`${styles.feed} container mt-10`}>
        <div className={`${styles.title} text text_type_main-large mb-5`}>
          Лента заказов
        </div>
        <div className={`${styles.belt} mr-15 pr-2`}>
          <OrdersFeed />
        </div>
        <div className={`${styles.belt}`}>
          <FeedDetails />
        </div>
      </main>
      <Outlet />
    </>
  );
};
