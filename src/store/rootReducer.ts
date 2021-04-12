/* eslint-disable import/no-cycle */
import { combineReducers } from '@reduxjs/toolkit';
import { counterSlice } from '../features/counter/slices/counter';
import { roleSlice } from '../features/poc/slices/role';

const rootReducer = combineReducers({
  counter: counterSlice.reducer,
  role: roleSlice.reducer,
});

export default rootReducer;
