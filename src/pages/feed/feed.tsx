import { OrdersFeed } from '@components/orders-feed/orders-feed';

import type { JSX } from 'react';

import styles from './feed.module.css';

export const FeedPage = (): JSX.Element => {
  return (
    <div className={`${styles.feed} container mt-10`}>
      <div className="text text_type_main-large mb-5">Лента заказов</div>
      <div className={`${styles.belt} mr-5`}>
        <OrdersFeed />
      </div>
      <div className={`${styles.belt}`}></div>
    </div>
  );
};
