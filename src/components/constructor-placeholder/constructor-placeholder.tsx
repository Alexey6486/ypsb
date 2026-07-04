import type { JSX } from 'react';

import styles from './constructor-placeholder.module.css';

type TProps = {
  text: string;
  type: 'top' | 'bottom' | 'middle';
};

export const ConstructorPlaceholder = ({ type, text }: TProps): JSX.Element => {
  let radius = '40px';

  switch (type) {
    case 'top': {
      radius = '88px 88px 40px 40px';
      break;
    }
    case 'bottom': {
      radius = '40px 40px 88px 88px';
      break;
    }
    default: {
      break;
    }
  }

  return (
    <div
      className={`${styles.placeholder_container} text text_type_main-default`}
      style={{
        borderRadius: radius,
      }}
    >
      {text}
    </div>
  );
};
