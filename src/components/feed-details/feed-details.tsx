import type { JSX } from 'react';

import styles from './feed-details.module.css';

export const FeedDetails = (): JSX.Element => {
  const all = 28752;
  const today = 138;
  // TODO Каждый из нижеследующих массивов должен содержать не более 20 записей
  const ready = [
    '034540',
    '034541',
    '034542',
    '034543',
    '034544',
    '034545',
    '034546',
    '034547',
    '034548',
    '034549',
    '034550',
  ];
  const in_progress = ['034533', '034534'];

  return (
    <div className={styles.feed_details}>
      <div className={`${styles.line} mb-15`}>
        <div className={`${styles.line_block} mr-9`}>
          <div className="text text_type_main-medium mb-6">Готовы:</div>
          <div
            className={styles.line_list}
            style={{
              gridTemplateRows: `repeat(${ready.length > 10 ? '10' : ready.length}, 1fr)`,
            }}
          >
            {ready.map((el, index) => (
              <span
                style={{ color: '#00CCCC' }}
                className={`text text_type_digits-default ${index !== 9 && index + 1 !== ready.length ? 'mb-2' : ''}`}
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
              gridTemplateRows: `repeat(${in_progress.length > 10 ? '10' : in_progress.length}, 1fr)`,
            }}
          >
            {in_progress.map((el, index) => (
              <span
                className={`text text_type_digits-default ${index !== 9 && index + 1 !== in_progress.length ? 'mb-2' : ''}`}
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
        <div className="text text_type_digits-large">{all}</div>
      </div>
      <div>
        <div className="text text_type_main-medium">Выполнено за сегодня:</div>
        <div className="text text_type_digits-large">{today}</div>
      </div>
    </div>
  );
};
