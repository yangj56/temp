import {
  Action,
  configureStore,
  ThunkAction,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
// eslint-disable-next-line import/no-cycle
import rootReducer from './rootReducer';

const middleware = [...getDefaultMiddleware(), logger];
export const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
