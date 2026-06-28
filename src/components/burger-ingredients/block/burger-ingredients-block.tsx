import type { ReactNode, JSX } from 'react';

type TProps = {
  title: string;
  children: ReactNode;
};

export const BurgerIngredientsBlock = ({ title, children }: TProps): JSX.Element => {
  return (
    <div className="mt-10">
      <h2 className="text text_type_main-medium">{title}</h2>
      {children}
    </div>
  );
};
