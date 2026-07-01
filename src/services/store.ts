import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useSelector,
  useDispatch as useDispatchBase,
} from 'react-redux';
import { combineReducers } from 'redux';

import ingredientsReducer from '@services/slices/ingredients-slice';
import modalIngredientReducer from '@services/slices/modal-ingredient-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  modalIngredient: modalIngredientReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export const listenerMiddleware = createListenerMiddleware<RootState>();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

//export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = useDispatchBase;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
