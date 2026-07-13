import { ModalOrder } from '@components/order/modal-order';
import { selectWsData } from '@services/slices/profile-ws-slice';
import { useAppSelector } from '@services/store';

import type { JSX } from 'react';

export const ProfileModalOrders = (): JSX.Element => {
  const { orders } = useAppSelector(selectWsData);

  return <ModalOrder orders={orders} />;
};
