import { FormattedDate } from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';

import { Price } from '@components/price/price';

import type { TOrderCardUI } from '@utils/types';
import type { JSX } from 'react';

import styles from './order-card.module.css';

type TProps = {
  data: TOrderCardUI;
};

enum STATUS_TEXT {
  done = 'Выполнен',
  pending = 'Готовится',
  created = 'Создан',
}

export const OrderCard = ({ data }: TProps): JSX.Element => {
  const { images, name, price, date, status, number } = data;
  return (
    <div className={styles.container}>
      <div className={`${styles.content} mb-6`}>
        <div className={`text text_type_digits-default`}>#{number}</div>
        <div className={`text text_type_main-default text_color_inactive`}>
          <FormattedDate date={new Date(date)} />
        </div>
      </div>
      <div className={`text text_type_main-medium mb-2`}>{name}</div>
      {status && (
        <div
          className={`${clsx({ [styles.status_done]: status === 'done' })} text text_type_main-default mb-2`}
        >
          {STATUS_TEXT[status]}
        </div>
      )}
      <div className={`${styles.content} mt-4`}>
        <div className={`${styles.images}`}>
          {images.map((el, index) => {
            if (index <= 5) {
              return (
                <div style={{ zIndex: images.length - index }} key={index}>
                  {images.length > 6 && index === 5 && (
                    <span className="text text_type_main-default">
                      +{images.length - 6}
                    </span>
                  )}
                  <img src={el} alt="ingredient-image" />
                </div>
              );
            }
            return null;
          })}
        </div>
        <Price
          typographyClass="text text_type_digits-default"
          price={price}
          iconSize="small"
        />
      </div>
    </div>
  );
};
