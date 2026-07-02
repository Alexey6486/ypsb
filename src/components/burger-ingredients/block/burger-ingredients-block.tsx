import { forwardRef } from 'react';

import type { ReactNode, RefAttributes } from 'react';

type BurgerIngredientsBlockProps = {
  title: string;
  children: ReactNode;
} & RefAttributes<HTMLDivElement>;

export const BurgerIngredientsBlock = forwardRef<
  HTMLDivElement,
  BurgerIngredientsBlockProps
>(({ title, children }, ref) => {
  return (
    <div className="pt-10" ref={ref}>
      <h2 className="text text_type_main-medium">{title}</h2>
      {children}
    </div>
  );
});

BurgerIngredientsBlock.displayName = 'BurgerIngredientsBlock';
