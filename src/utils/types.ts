export type TIngredientType = 'bun' | 'main' | 'sauce';

export type TIngredientDto = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientUI = {
  nanoid: string;
  counter: number;
} & TIngredientDto;

export type TIngredientsSorted = {
  bun: TIngredientUI[];
  main: TIngredientUI[];
  sauce: TIngredientUI[];
};

export type TNullable<T> = T | null;

export type TOrderDetails = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

export type TOrder = {
  ingredients: string[];
};

export type TLoginForm = {
  email: string;
  password: string;
};

export type TUser = {
  name: string;
  email: string;
};
