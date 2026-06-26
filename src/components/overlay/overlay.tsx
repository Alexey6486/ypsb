import type { JSX } from 'react';

import styles from './overlay.module.css';

export const Overlay = ({ onClose }: { onClose: () => void }): JSX.Element => {
  return <div className={styles.overlay} onClickCapture={onClose} />;
};
