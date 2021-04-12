/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from 'contants';
// eslint-disable-next-line import/no-cycle
import { RootState } from 'store/store';

// Define a type for the slice state
type RoleState = {
  value: string;
};

// Define the initial state using that type
const initialState: RoleState = {
  value: Role.PUBLIC,
};

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setRole: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setRole } = roleSlice.actions;
export const selectRole = (state: RootState) => state.role.value;
