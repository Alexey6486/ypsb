import {
  Button,
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useLayoutEffect, useState } from 'react';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { Price } from '@components/price/price';
import { useWindowSize } from '@hooks/useWindowSize';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[] | null;
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [scrollableSize, setScrollableSize] = useState(0);
  const windowSize = useWindowSize();

  console.log('BurgerConstructor render');

  const handleOpenModal = (): void => {
    setIsModalVisible(true);
  };

  const handleCloseModal = (): void => {
    setIsModalVisible(false);
  };

  useLayoutEffect(() => {
    const { height } = windowSize;
    const diff = height - 561;
    setScrollableSize(diff);
  }, [windowSize]);

  useEffect(() => {
    if (ingredients) {
      const price = ingredients
        ? ingredients.reduce((acc, item) => {
            return acc + item.price;
          }, 0)
        : 0;
      setTotalPrice(price);
    }
  }, [ingredients]);

  return (
    <>
      <section className={`${styles.burger_constructor} mb-10 pt-5 pr-4 pb-10 pl-4`}>
        {ingredients && (
          <>
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
                {ingredients
                  .filter((item) => item.type !== 'bun')
                  .map((item) => {
                    const { name, price, image_mobile, _id } = item;
                    return (
                      <div
                        key={_id}
                        className={`${styles.burger_constructor_item} mb-4 mr-1`}
                      >
                        <DragIcon
                          type="primary"
                          className={styles.ingredient_drag_icon}
                        />
                        <div className={`${styles.burger_constructor_ingredient} ml-2`}>
                          <ConstructorElement
                            handleClose={() => {
                              console.log('delete');
                            }}
                            price={price}
                            text={name}
                            thumbnail={image_mobile}
                          />
                        </div>
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
                onClick={handleOpenModal}
                size="large"
                type="primary"
                htmlType="button"
                extraClass="ml-10"
              >
                Оформить заказ
              </Button>
            </div>
          </>
        )}
      </section>
      {isModalVisible && (
        <Modal title="" onClose={handleCloseModal}>
          <OrderDetails orderId="123456" />
        </Modal>
      )}
    </>
  );
};
