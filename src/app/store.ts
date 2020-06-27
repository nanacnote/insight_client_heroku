import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { selectorReducer, equityReducer } from '../views';

export const store = configureStore({
  reducer: {
    equity: equityReducer,
    selector: selectorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
