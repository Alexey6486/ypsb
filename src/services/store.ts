import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
  type TypedUseSelectorHook,
} from 'react-redux';
import { combineReducers } from 'redux';

import { ingredientsReducer } from '@services/ingredients/slices';

export const reducer = combineReducers({
  ingredients: ingredientsReducer,
});

export type RootState = ReturnType<typeof reducer>;

export const listenerMiddleware = createListenerMiddleware<RootState>();

export const store = configureStore({
  reducer,
  preloadedState: {
    ingredients: {
      ingredients: null,
      order: null,
      isLoading: true,
      error: null,
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = useDispatchBase;

export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;
