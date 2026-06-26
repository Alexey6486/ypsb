import {
  Button,
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useLayoutEffect, useState } from 'react';

import { Price } from '@components/price/price';
import { useWindowSize } from '@hooks/useWindowSize';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): JSX.Element => {
  const [scrollableSize, setScrollabelSize] = useState(0);
  const windowSize = useWindowSize();

  console.log(ingredients);

  const totalPrice = ingredients.reduce((acc, item) => {
    return acc + item.price;
  }, 0);

  useLayoutEffect(() => {
    const { height } = windowSize;
    const diff = height - 561;
    setScrollabelSize(diff);
  }, [windowSize, ingredients]);

  return (
    <section className={`${styles.burger_constructor} mb-10 pt-5 pr-4 pb-10 pl-4`}>
      <div className="mb-10">
        <div className="mb-4 pl-8 pr-4">
          <ConstructorElement
            handleClose={() => null}
            isLocked
            price={200}
            text="Краторная булка N-200i (верх)"
            thumbnail="https://react-burger-ui-components.education-services.ru/assets/img-CFqVEZmj.png"
            type="top"
            extraClass={styles.burger_constructor_item}
          />
        </div>
        <div
          className={`${styles.burger_constructor_list} custom-scroll`}
          style={{ height: scrollableSize }}
        >
          {ingredients.map(({ name, price, image_mobile, _id }) => {
            return (
              <div key={_id} className={`${styles.burger_constructor_item} mb-4 mr-1`}>
                <DragIcon type="primary" />
                <ConstructorElement
                  handleClose={() => null}
                  price={price}
                  text={name}
                  thumbnail={image_mobile}
                  extraClass="ml-2"
                />
              </div>
            );
          })}
        </div>
        <div className="mb-4 pl-8 pr-4">
          <ConstructorElement
            handleClose={() => null}
            isLocked
            price={200}
            text="Краторная булка N-200i (низ)"
            thumbnail="https://react-burger-ui-components.education-services.ru/assets/img-CFqVEZmj.png"
            type="bottom"
            extraClass={styles.burger_constructor_item}
          />
        </div>
      </div>
      <div className={`${styles.burger_constructor_footer} mb-3`}>
        <Price
          price={totalPrice}
          typographyClass="text_type_digits-medium"
          iconSize="large"
        />
        <Button
          onClick={() => null}
          size="large"
          type="primary"
          htmlType="button"
          extraClass="ml-10"
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
