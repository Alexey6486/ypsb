import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { Order } from '@components/order/order';
import {
  fetchOrderByIdThunk,
  modalDealSlice,
  selectModalDeal,
  selectModalDealError,
} from '@services/slices/modal-deal-slice';
import { useAppDispatch, useAppSelector } from '@services/store';

import type { TOrderCardUI } from '@utils/types';
import type { JSX } from 'react';

type TProps = {
  orders: TOrderCardUI[];
};

export const ModalOrder = ({ orders }: TProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();
  const order = useAppSelector(selectModalDeal);
  const error = useAppSelector(selectModalDealError);

  const backUrl = location.pathname.includes('profile/orders')
    ? '/profile/orders'
    : '/feed';

  const handleCloseModal = (): void => {
    dispatch(modalDealSlice.actions.closeModalDealData());
    void navigate(backUrl);
  };

  useEffect(() => {
    if (order || error) {
      return;
    }

    if (orders?.length) {
      const target = orders.find((el) => el.id === params.id);

      if (target) {
        dispatch(modalDealSlice.actions.setModalDealData(target));
        return;
      } else {
        void dispatch(fetchOrderByIdThunk(params.id));
      }
    }
  }, [orders]);

  return (
    <>
      {(order ?? error) && (
        <Modal
          title={order ? `#${order.number}` : ''}
          titleTypography="text_type_digits-medium"
          onClose={handleCloseModal}
        >
          {order && <Order order={order} />}
          {error && <div className="text text_type_main-medium -mt-2">{error}</div>}
          {!order && !error && <Preloader />}
        </Modal>
      )}
    </>
  );
};
