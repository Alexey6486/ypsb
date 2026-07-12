import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import feedReducer from '@services/slices/feed-slice';
import ingredientsReducer from '@services/slices/ingredients-slice';
import modalDealReducer from '@services/slices/modal-deal-slice';
import modalIngredientReducer from '@services/slices/modal-ingredient-slice';
import modalOrderReducer from '@services/slices/modal-order-slice';
import userReducer from '@services/slices/user-slice';
import socketReducer from '@services/slices/ws-slice';
import socketMiddleware from '@services/socket/socket';

const reducer = combineReducers({
  ingredients: ingredientsReducer,
  modalIngredient: modalIngredientReducer,
  modalOrder: modalOrderReducer,
  user: userReducer,
  modalDeal: modalDealReducer,
  feed: feedReducer,
  socket: socketReducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware(true)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// при такой типизации useDispatch ушли подчеркивания в компонентах, теперь диспач узнает санки
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = useSelector.withTypes<RootState>();
