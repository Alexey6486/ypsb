import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { OrderCard } from '@components/order-card/order-card';
import { modalDealSlice } from '@services/slices/modal-deal-slice';
import { selectWsData, isWsLoading, isWsConnected } from '@services/slices/ws-slice';
import { useAppDispatch, useAppSelector } from '@services/store';

import type { TOrderCardUI } from '@utils/types';
import type { JSX } from 'react';

export const OrdersFeed = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(selectWsData);
  const isLoading = useAppSelector(isWsLoading);
  const isConnected = useAppSelector(isWsConnected);

  const handleOpenModal = (value: TOrderCardUI): void => {
    dispatch(modalDealSlice.actions.setModalDealData(value));
    void navigate(`/feed/${value.id}`);
  };

  return (
    <>
      {(!isConnected || isLoading) && (
        <div className="preloader-wrapper">
          <Preloader />
        </div>
      )}
      {orders?.map?.((el) => (
        <OrderCard key={el.number} data={el} onClick={handleOpenModal} />
      ))}
    </>
  );
};
