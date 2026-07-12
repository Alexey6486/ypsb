import { Outlet, useNavigate } from 'react-router-dom';

import { OrderCard } from '@components/order-card/order-card';
import { modalDealSlice } from '@services/slices/modal-deal-slice';
import { selectWsData } from '@services/slices/ws-slice';
import { useAppDispatch, useAppSelector } from '@services/store';

import type { TOrderCardUI } from '@utils/types';
import type { JSX } from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrdersPage = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectWsData);

  console.log('ProfileOrdersPage', { data });

  const handleOpenModal = (value: TOrderCardUI): void => {
    dispatch(modalDealSlice.actions.setModalDealData(value));
    void navigate(`/profile/orders/${value.id}`);
  };

  return (
    <>
      <div className={`${styles.container} pr-2`}>
        {data.orders &&
          data.orders.length > 0 &&
          data.orders.map((el) => (
            <OrderCard key={el.number} data={el} onClick={handleOpenModal} />
          ))}
      </div>
      <Outlet />
    </>
  );
};
