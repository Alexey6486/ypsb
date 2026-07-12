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

export type TRegisterForm = {
  email: string;
  password: string;
  name: string;
};

export type TForgotPasswordForm = {
  email: string;
};

export type TResetPasswordForm = {
  password: string;
  token: string;
};

export type TUser = {
  name: string;
  email: string;
};

export type TUserResponse = {
  success: boolean;
  user: TUser;
};

export type TLoginResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

export type TRefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TAuthServiceResponse = {
  success: boolean;
  message: string;
};

export type TProfileSettingsForm = {
  email: string;
  name: string;
  newPassword: string;
};

export type TLocationState = {
  state: { from?: { pathname: string } };
};

export type TOrderStatusType = 'done' | 'pending' | 'created';

export type TOrderDto = {
  ingredients: string[];
  _id: string;
  status: TOrderStatusType;
  number: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type TOrdersResponseDto = {
  success: boolean;
  orders: TOrderDto[];
  total: number;
  totalToday: number;
  message?: string;
};

export type TOrderCardUI = {
  id: string;
  name: string;
  date: string;
  number: number;
  status: string;
  price: number;
  ingredients: TIngredientUI[];
};
