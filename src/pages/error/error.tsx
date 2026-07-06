import type { JSX } from 'react';

import styles from './error.module.css';

type TProps = {
  code: string;
  text: string;
};

export const ErrorPage = ({ code, text }: TProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className="text text_type_digits-large mb-10">{code}</div>
      <div className="text text_type_main-medium">{text}</div>
    </div>
  );
};
