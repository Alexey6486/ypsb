import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { Order } from '@components/order/order';
import {
  fetchOrderByIdThunk,
  modalDealSlice,
  selectModalDeal,
} from '@services/slices/modal-deal-slice';
import { isWsConnected, selectWsData } from '@services/slices/ws-slice';
import { useAppDispatch, useAppSelector } from '@services/store';

import type { JSX } from 'react';

export const ModalOrder = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();
  const order = useAppSelector(selectModalDeal);
  const { orders } = useAppSelector(selectWsData);
  const isConnected = useAppSelector(isWsConnected);

  const backUrl = location.pathname.includes('profile/orders')
    ? '/profile/orders'
    : '/feed';

  const handleCloseModal = (): void => {
    dispatch(modalDealSlice.actions.setModalDealData(null));
    void navigate(backUrl);
  };

  useEffect(() => {
    if (order) {
      return;
    }

    if (!order?.id && orders && params.id) {
      const target = orders.find((el) => el.id === 'params.id');

      if (target) {
        dispatch(modalDealSlice.actions.setModalDealData(target));
        return;
      }

      if (isConnected && (orders.length > 0 || !target)) {
        void dispatch(fetchOrderByIdThunk(params.id));
      }

      return;
    }

    if (!params.id && !order && isConnected && orders && orders.length === 0) {
      void navigate(backUrl);
    }
  }, [orders]);

  return (
    <>
      {order ? (
        <Modal
          title={`#${order.number}`}
          titleTypography="text_type_digits-medium"
          onClose={handleCloseModal}
        >
          <Order order={order} />
        </Modal>
      ) : null}
    </>
  );
};
