import { ModalOrder } from '@components/order/modal-order';
import { selectWsData } from '@services/slices/feed-ws-slice';
import { useAppSelector } from '@services/store';

import type { JSX } from 'react';

export const FeedModalOrders = (): JSX.Element => {
  const { orders } = useAppSelector(selectWsData);

  return <ModalOrder orders={orders} />;
};
