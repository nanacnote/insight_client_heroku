import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { counterReducer, selectorReducer, equityReducer } from '../views';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
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
