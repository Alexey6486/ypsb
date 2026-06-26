export type TIngredientType = 'bun' | 'main' | 'sauce';

export type TIngredient = {
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

export type TIngredientsSorted = {
  bun: TIngredient[];
  main: TIngredient[];
  sauce: TIngredient[];
};

export type TAppState = {
  ingredients: TIngredientsSorted | null;
  order: TIngredient[] | null;
  isLoading: boolean;
};
