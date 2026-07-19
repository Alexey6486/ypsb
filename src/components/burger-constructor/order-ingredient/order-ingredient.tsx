import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrag, useDrop } from 'react-dnd';

import type { TIngredientUI, TIngredientType } from '@utils/types';
import type { JSX } from 'react';

import commonStyles from '../burger-constructor-common.module.css';
import styles from './order-ingredient.module.css';

type TProps = {
  ingredient: TIngredientUI;
  index: number;
  onRemove: (id: string, nanoid: string, type: TIngredientType) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
};

export const OrderIngredient = ({
  ingredient,
  index,
  onRemove,
  onMove,
}: TProps): JSX.Element => {
  const { nanoid, _id, price, type, image_mobile, name } = ingredient;

  const [, dragRef] = useDrag({
    type: 'orderIngredient',
    item: { index: index },
  });

  const [, dropRef] = useDrop({
    accept: 'orderIngredient',
    hover(item: { index: number }) {
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      item.index = hoverIndex;

      onMove(dragIndex, hoverIndex);
    },
  });

  const handleRemove = (): void => {
    onRemove(_id, nanoid, type);
  };

  return (
    <div
      className={`${commonStyles.burger_constructor_item} mb-4 mr-1 pw-ingredient-order`}
      ref={(node) => dragRef(dropRef(node))}
      style={{ opacity: dragRef.isDrag ? 0.8 : 1 }}
    >
      <DragIcon type="primary" className={styles.ingredient_drag_icon} />
      <div className={`${commonStyles.burger_constructor_ingredient} ml-2`}>
        <ConstructorElement
          handleClose={handleRemove}
          price={price}
          text={name}
          thumbnail={image_mobile}
        />
      </div>
    </div>
  );
};
