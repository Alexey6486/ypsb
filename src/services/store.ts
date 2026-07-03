import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useSelector as useSelectorBase,
  useDispatch as useDispatchBase,
} from 'react-redux';

import ingredientsReducer from './ingredients-slice';
import modalIngredientReducer from './modal-ingredient-slice';
import modalOrderReducer from './modal-order-slice';

export const reducer = combineReducers({
  ingredients: ingredientsReducer,
  modalIngredient: modalIngredientReducer,
  modalOrder: modalOrderReducer,
});

export type RootState = ReturnType<typeof reducer>;
export const listenerMiddleware = createListenerMiddleware<RootState>();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = useDispatchBase;
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;
