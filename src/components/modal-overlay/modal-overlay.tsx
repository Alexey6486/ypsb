import type { JSX } from 'react';

import styles from './modal-overlay.module.css';

export const ModalOverlay = ({ onClose }: { onClose: () => void }): JSX.Element => {
  return <div className={styles.modal_overlay} onClickCapture={onClose} />;
};
