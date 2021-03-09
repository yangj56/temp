/* eslint-disable no-param-reassign */
import { createAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface CounterState {
  value: number;
}

export const incrementBy = createAction<number>('incrementBy');

// Define the initial state using that type
const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(incrementBy, (state: any, action) => {
      // action is inferred correctly here
      state.counter += action.payload;
    });
  },
});

export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
