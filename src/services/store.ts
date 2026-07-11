import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import ingredientsReducer from '@services/slices/ingredients-slice';
import modalDealReducer from '@services/slices/modal-deal-slice';
import modalIngredientReducer from '@services/slices/modal-ingredient-slice';
import modalOrderReducer from '@services/slices/modal-order-slice';
import userReducer from '@services/slices/user-slice';

const reducer = combineReducers({
  ingredients: ingredientsReducer,
  modalIngredient: modalIngredientReducer,
  modalOrder: modalOrderReducer,
  user: userReducer,
  modalDeal: modalDealReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// при такой типизации useDispatch ушли подчеркивания в компонентах, теперь диспач узнает санки
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = useSelector.withTypes<RootState>();
