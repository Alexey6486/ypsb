import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import ingredientsReducer from './slices/ingredients-slice';
import modalIngredientReducer from './slices/modal-ingredient-slice';
import modalOrderReducer from './slices/modal-order-slice';
import userReducer from './slices/user-slice';

export const reducer = combineReducers({
  ingredients: ingredientsReducer,
  modalIngredient: modalIngredientReducer,
  modalOrder: modalOrderReducer,
  user: userReducer,
});

// export const listenerMiddleware = createListenerMiddleware<RootState>();

export const store = configureStore({
  reducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): ReturnType<typeof useDispatch<AppDispatch>> =>
  useDispatch<AppDispatch>();
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
