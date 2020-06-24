// the equity slice
// 1. makes a request to the api for a list of companies to make available to client to choose
// from in the selector feature

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

type TState = {
  value: object,
}
const initialState: TState = {
    value: {},
}

export const companyListSlice = createSlice({
  name: 'companyList',
  initialState,
  reducers: {
    getCompanyList: (state, action: PayloadAction<object>) => {
        state.value = action.payload;
    },
  },
});

export const { getCompanyList } = companyListSlice.actions;

export const companyListValue = (state: RootState) => state.equity.value;

export default companyListSlice.reducer;
