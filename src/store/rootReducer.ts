/* eslint-disable import/no-cycle */
import { combineReducers } from '@reduxjs/toolkit';
import { counterSlice } from '../features/counter/slices/counter';

const rootReducer = combineReducers({
  counter: counterSlice.reducer,
});

export default rootReducer;
