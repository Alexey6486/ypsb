import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import {
  isWsConnected,
  isWsLoading,
  selectWsData,
} from '@services/slices/feed-ws-slice';
import { useAppSelector } from '@services/store';

import type { JSX } from 'react';

import styles from './feed-details.module.css';

export const FeedDetails = (): JSX.Element => {
  const [state, setState] = useState<{ done: string[]; pending: string[] }>({
    done: [],
    pending: [],
  });
  const { orders, total, totalToday } = useAppSelector(selectWsData);
  const isLoading = useAppSelector(isWsLoading);
  const isConnected = useAppSelector(isWsConnected);

  useEffect(() => {
    if (orders) {
      const done = [];
      const pending = [];

      const sorted = [...orders].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return dateB - dateA;
      });

      for (const item of sorted) {
        if (done.length === 20 && pending.length === 20) {
          break;
        }

        if (item.status === 'done') {
          done.push(item.number);
        }

        if (item.status === 'pending') {
          pending.push(item.number);
        }
      }

      setState({ done, pending });
    }
  }, [orders]);

  return (
    <>
      {(!isConnected || isLoading) && (
        <div className="preloader-wrapper">
          <Preloader />
        </div>
      )}
      <div className={styles.feed_details}>
        <div className={`${styles.line} mb-15`}>
          <div className={`${styles.line_block} mr-9`}>
            <div className="text text_type_main-medium mb-6">Готовы:</div>
            <div
              className={styles.line_list}
              style={{
                gridTemplateRows: `repeat(${state.done.length > 10 ? '10' : state.done.length}, 1fr)`,
              }}
            >
              {state.done.map((el, index) => (
                <span
                  style={{ color: '#00CCCC' }}
                  className={`text text_type_digits-default ${index !== 9 && index + 1 !== state.done.length ? 'mb-2' : ''}`}
                  key={el}
                >
                  {el}
                </span>
              ))}
            </div>
          </div>
          <div className={`${styles.line_block}`}>
            <div className="text text_type_main-medium mb-6">В работе:</div>
            <div
              className={styles.line_list}
              style={{
                gridTemplateRows: `repeat(${state.pending.length > 10 ? '10' : state.pending.length}, 1fr)`,
              }}
            >
              {state.pending.map((el, index) => (
                <span
                  className={`text text_type_digits-default ${index !== 9 && index + 1 !== state.pending.length ? 'mb-2' : ''}`}
                  key={el}
                >
                  {el}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-15">
          <div className="text text_type_main-medium">Выполнено за все время:</div>
          <div className="text text_type_digits-large">{total}</div>
        </div>
        <div>
          <div className="text text_type_main-medium">Выполнено за сегодня:</div>
          <div className="text text_type_digits-large">{totalToday}</div>
        </div>
      </div>
    </>
  );
};
