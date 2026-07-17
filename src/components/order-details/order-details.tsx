import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import type { JSX } from 'react';

import styles from './order-details.module.css';

type TProps = {
  orderId: number;
};

export const OrderDetails = ({ orderId }: TProps): JSX.Element => {
  return (
    <div className={styles.order_details_container} data-testid="pw-modal-order">
      <p className="text text_type_digits-large mb-8">{orderId}</p>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <div className={`${styles.order_details_graphics} mb-15`}>
        <img src="/waves.svg" alt="waves-image" />
        <CheckMarkIcon type="primary" className={styles.order_details_icon} />
      </div>
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive mb-20">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
