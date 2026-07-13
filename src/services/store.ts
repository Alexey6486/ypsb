import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import { feedWsSlice } from '@services/slices/feed-ws-slice';
import ingredientsReducer from '@services/slices/ingredients-slice';
import modalDealReducer from '@services/slices/modal-deal-slice';
import modalIngredientReducer from '@services/slices/modal-ingredient-slice';
import modalOrderReducer from '@services/slices/modal-order-slice';
import { profileWsSlice } from '@services/slices/profile-ws-slice';
import userReducer from '@services/slices/user-slice';
import socketMiddleware from '@services/socket/socket';

import type { TWSActions } from '@utils/types';

const reducer = combineReducers({
  ingredients: ingredientsReducer,
  modalIngredient: modalIngredientReducer,
  modalOrder: modalOrderReducer,
  user: userReducer,
  modalDeal: modalDealReducer,
  feedWs: feedWsSlice.reducer,
  profileWs: profileWsSlice.reducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      socketMiddleware(false, feedWsSlice.name, feedWsSlice.actions as TWSActions),
      socketMiddleware(true, profileWsSlice.name, profileWsSlice.actions as TWSActions)
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// при такой типизации useDispatch ушли подчеркивания в компонентах, теперь диспач узнает санки
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = useSelector.withTypes<RootState>();
