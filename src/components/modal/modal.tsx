import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import type { JSX, PropsWithChildren } from 'react';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modal');

type TProps = {
  title: string;
  titleTypography?: string;
  onClose: () => void;
};

export const Modal = ({
  title,
  titleTypography,
  onClose,
  children,
}: PropsWithChildren<TProps>): JSX.Element => {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      event.key === 'Escape' && onClose();
    }
    document.addEventListener('keydown', handleEscape);

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal_container} data-testid="pw-modal">
        <h2
          className={`${styles.modal_title} text ${titleTypography ?? 'text_type_main-large'}`}
        >
          {title}
        </h2>
        <div
          data-testid="pw-modal-close"
          onClick={onClose}
          className={styles.modal_close}
        >
          <CloseIcon type="primary" />
        </div>
        {children}
      </div>
    </>,
    modalRoot!
  );
};
