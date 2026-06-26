import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { ModalOverlay } from '@components/modal-overlay/modal-overlay';
import { OrderDetails } from '@components/order-details/order-details';

import type { TModalType, TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modal');

export const Modal = ({
  type,
  ingredient,
  isOpened,
  onClose,
}: {
  type: TModalType | null; // все пропсы будут удалены, данные будут браться из redux, cb заменены на dispatch
  ingredient: TIngredient | null;
  isOpened: boolean;
  onClose: () => void;
}): JSX.Element => {
  let component = null;
  let title = '';

  switch (type) {
    case 'ingredients': {
      title = 'Детали ингредиента';
      if (ingredient) {
        component = <IngredientDetails ingredient={ingredient} />;
      }
      break;
    }
    case 'details': {
      component = <OrderDetails orderId="123456" />;
      break;
    }
    default: {
      break;
    }
  }

  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      event.key === 'Escape' && onClose();
    }
    document.addEventListener('keydown', handleEscape);

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!isOpened) {
    return <></>;
  }

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal_container}>
        <h2 className={`${styles.modal_title} text text_type_main-large`}>{title}</h2>
        <CloseIcon type="primary" onClick={onClose} className={styles.modal_close} />
        {component}
      </div>
    </>,
    modalRoot
  );
};
