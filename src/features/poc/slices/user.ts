/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Eservice, Role } from 'contants';
// eslint-disable-next-line import/no-cycle
import { RootState } from 'store/store';

// Define a type for the slice state
type RoleState = {
  role: string;
  userID: string;
  salt: string;
  iv: string;
  publicKey: string;
  encryptedPrivateKey: string;
  appState: string[];
  eservice: Eservice | null;
};

// Define the initial state using that type
const initialState: RoleState = {
  role: Role.PUBLIC,
  userID: '',
  salt: '',
  iv: '',
  publicKey: '',
  encryptedPrivateKey: '',
  appState: [],
  eservice: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    setUserID: (state, action: PayloadAction<string>) => {
      state.userID = action.payload;
    },
    setSalt: (state, action: PayloadAction<string>) => {
      state.salt = action.payload;
    },
    setIV: (state, action: PayloadAction<string>) => {
      state.iv = action.payload;
    },
    setPublicKey: (state, action: PayloadAction<string>) => {
      state.publicKey = action.payload;
    },
    setEncryptedPrivateKey: (state, action: PayloadAction<string>) => {
      state.encryptedPrivateKey = action.payload;
    },
    insertAppState: (state, action: PayloadAction<string>) => {
      state.appState.push(action.payload);
    },
    setEservice: (state, action: PayloadAction<Eservice>) => {
      state.eservice = action.payload;
    },
  },
});

export const {
  setRole,
  setUserID,
  setSalt,
  setIV,
  setPublicKey,
  setEncryptedPrivateKey,
  insertAppState,
  setEservice,
} = userSlice.actions;
export const selectRole = (state: RootState) => state.user.role;
export const selectUserID = (state: RootState) => state.user.userID;
export const selectSalt = (state: RootState) => state.user.salt;
export const selectIV = (state: RootState) => state.user.iv;
export const selectPublicKey = (state: RootState) => state.user.publicKey;
export const selectAppState = (state: RootState) => state.user.appState;
export const selectEservice = (state: RootState) => state.user.eservice;
export const selectEncryptedPrivateKey = (state: RootState) =>
  state.user.encryptedPrivateKey;
