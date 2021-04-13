/* eslint-disable import/no-cycle */
import { combineReducers } from '@reduxjs/toolkit';
import { counterSlice } from '../features/counter/slices/counter';
import { userSlice } from '../features/poc/slices/user';

const rootReducer = combineReducers({
  counter: counterSlice.reducer,
  user: userSlice.reducer,
});

export default rootReducer;
