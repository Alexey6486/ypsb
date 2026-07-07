import {
  Button,
  ConstructorElement,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { nanoid } from '@reduxjs/toolkit';
import { clsx } from 'clsx';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { OrderIngredient } from '@components/burger-constructor/order-ingredient/order-ingredient';
import { ConstructorPlaceholder } from '@components/constructor-placeholder/constructor-placeholder';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { Price } from '@components/price/price';
import { useWindowSize } from '@hooks/useWindowSize';
import {
  setOrderIngredient,
  removeIngredient,
  resetOrder,
  moveOrderIngredient,
  selectOrder,
} from '@services/slices/ingredients-slice';
import {
  selectModalOrder,
  setModalOrderData,
  sendOrderThunk,
  selectIsLoading,
} from '@services/slices/modal-order-slice';
import { selectIsAuthChecked, selectUser } from '@services/slices/user-slice';
import { useAppDispatch, useAppSelector } from '@services/store';

import type {
  TLocationState,
  TIngredientType,
  TIngredientUI,
  TOrder,
} from '@utils/types';
import type { JSX } from 'react';

import commonStyles from './burger-constructor-common.module.css';
import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): JSX.Element => {
  const { bun, ingredients } = useAppSelector(selectOrder);
  const isLoading = useAppSelector(selectIsLoading);
  const details = useAppSelector(selectModalOrder);
  const isAuthed = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation<TLocationState>();

  const dispatch = useAppDispatch();

  const [totalPrice, setTotalPrice] = useState(0);
  const [scrollableSize, setScrollableSize] = useState(0);
  const windowSize = useWindowSize();

  const [{ isOver }, dropTarget] = useDrop({
    accept: 'ingredient',
    drop({ ingredient }: { ingredient: TIngredientUI }) {
      if (bun && bun._id === ingredient._id) {
        return;
      }
      dispatch(setOrderIngredient({ ...ingredient, nanoid: nanoid() }));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleSendOrder = (): void => {
    if (!isAuthed || (isAuthed && !user)) {
      return void navigate('/login', {
        state: { from: { pathname: location?.pathname ?? '/' } },
      });
    }

    if (!bun || !ingredients.length) return;

    const data: TOrder = {
      ingredients: [bun._id, ...ingredients.map((el) => el._id), bun._id],
    };

    void dispatch(sendOrderThunk(data));
  };

  const handleCloseModal = (): void => {
    dispatch(setModalOrderData(null));
    dispatch(resetOrder());
  };

  const handleRemoveIngredient = (
    id: string,
    nanoid: string,
    type: TIngredientType
  ): void => {
    dispatch(removeIngredient({ id, nanoid, type }));
  };

  const handleOrderIngredientMove = (dragIndex: number, hoverIndex: number): void => {
    dispatch(moveOrderIngredient({ from: dragIndex, to: hoverIndex }));
  };

  useLayoutEffect(() => {
    const { height } = windowSize;
    const diff = height - 561;
    setScrollableSize(diff);
  }, [windowSize]);

  useEffect(() => {
    if (ingredients) {
      let price = ingredients
        ? ingredients.reduce((acc, item) => {
            return acc + item.price;
          }, 0)
        : 0;
      if (bun) {
        price += bun.price * 2;
      }
      setTotalPrice(price);
    }
  }, [ingredients, bun]);

  return (
    <>
      <section className={`${styles.burger_constructor} mb-10 pt-5 pr-4 pb-10 pl-4`}>
        <div
          className={`${clsx({ [styles.burger_constructor_hover]: isOver })} mb-10`}
          ref={dropTarget}
        >
          {isLoading && (
            <div className={styles.burger_constructor_loader}>
              <Preloader />
            </div>
          )}
          <div className={`${commonStyles.burger_constructor_item} mb-4 mr-1`}>
            <div className={`${commonStyles.burger_constructor_ingredient} ml-2`}>
              {bun ? (
                <ConstructorElement
                  handleClose={() => null}
                  isLocked
                  price={bun.price}
                  text={`${bun.name} (верх)`}
                  thumbnail={bun.image_mobile}
                  type="top"
                />
              ) : (
                <ConstructorPlaceholder type="top" text="Выберете булки" />
              )}
            </div>
          </div>
          <div
            className={`${styles.burger_constructor_list} custom-scroll`}
            style={{ height: scrollableSize }}
          >
            {ingredients.length > 0 ? (
              ingredients.map((item, index) => {
                const { nanoid } = item;
                return (
                  <OrderIngredient
                    key={nanoid}
                    ingredient={item}
                    index={index}
                    onRemove={handleRemoveIngredient}
                    onMove={handleOrderIngredientMove}
                  />
                );
              })
            ) : (
              <div className={`${commonStyles.burger_constructor_item} mb-4 mr-1`}>
                <div className={`${commonStyles.burger_constructor_ingredient} ml-2`}>
                  <ConstructorPlaceholder type="middle" text="Выберете начинку" />
                </div>
              </div>
            )}
          </div>
          <div className={`${commonStyles.burger_constructor_item} mb-4 mr-1`}>
            <div className={`${commonStyles.burger_constructor_ingredient} ml-2`}>
              {bun ? (
                <ConstructorElement
                  handleClose={() => null}
                  isLocked
                  price={bun.price}
                  text={`${bun.name} (низ)`}
                  thumbnail={bun.image_mobile}
                  type="bottom"
                />
              ) : (
                <ConstructorPlaceholder type="bottom" text="Выберете булки" />
              )}
            </div>
          </div>
        </div>
        <div className={`${styles.burger_constructor_footer} mb-3`}>
          <Price
            price={totalPrice}
            typographyClass="text_type_digits-medium"
            iconSize="large"
          />
          <Button
            onClick={handleSendOrder}
            size="large"
            type="primary"
            htmlType="button"
            extraClass="ml-10"
          >
            Оформить заказ
          </Button>
        </div>
      </section>
      {details && (
        <Modal title="" onClose={handleCloseModal}>
          <OrderDetails orderId={details.order.number} />
        </Modal>
      )}
    </>
  );
};
