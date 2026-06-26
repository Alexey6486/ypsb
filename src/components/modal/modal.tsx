import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { Overlay } from '@components/overlay/overlay';

import type { TModalType } from '@utils/types';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modal');

export const Modal = ({
  type,
  isOpened,
  onClose,
}: {
  type: TModalType | null;
  isOpened: boolean;
  onClose: () => void;
}): JSX.Element => {
  let component = null;

  switch (type) {
    case 'ingredients': {
      component = <div>ingredients</div>;
      break;
    }
    case 'details': {
      component = <div>details</div>;
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
      <Overlay onClose={onClose} />
      <div className={styles.modal_container}>
        <CloseIcon type="primary" onClick={onClose} className={styles.modal_close} />
        {component}
      </div>
    </>,
    modalRoot
  );
};
