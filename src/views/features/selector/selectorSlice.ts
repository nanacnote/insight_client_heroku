import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";

type selectorState = {
  //overview data declaration
  value_1: {
    [key: string]: string | undefined,
  },
  // current year financial data
  value_2: {
    [key: string]: { [key: string]: string | undefined },
  },
  // previous year financial data
  value_3: {
    [key: string]: { [key: string]: string | undefined },
  },
  // previous two year financial data
  value_4: {
    [key: string]: { [key: string]: string | undefined },
  },
  // previous three years financial data
  value_5: {
    [key: string]: { [key: string]: string | undefined },
  },
  // previous four years financial data
  value_6: {
    [key: string]: { [key: string]: string | undefined },
  },
  value_7 :object,
}

// repeat initialiser value
const initial_data = {
  ticker_name: undefined,
  ticker_description: undefined,
  last_price: undefined,
  price_change: undefined,
  open_price: undefined,
  last_close_price: undefined,
  high_price: undefined,
  low_price: undefined,
  bid_price: undefined,
  offer_price: undefined,
  volume: undefined,
  turnover: undefined,
  ytd: undefined,
  one_year_return: undefined,
  market_cap: undefined,
}

const initialState: selectorState = {
  value_1: {
    company_name: undefined,
  },
  value_2: {},
  value_3: {},
  value_4: {},
  value_5: {},
  value_6: {},
  value_7: {
    data: initial_data,
  },
};

export const selectorSlice = createSlice({
  name: "selector",
  initialState,
  reducers: {
    // gets the company overview data from the api (the history, business model, etc)
    getCompanyData_1: (state, action: PayloadAction<{}>) => {
      state.value_1 = action.payload;
    },
    // gets the company current financial data from the api
    getCompanyData_2: (state, action: PayloadAction<{}>) => {
      state.value_2 = action.payload;
    },
    // gets the company previous financial data from the api
    getCompanyData_3: (state, action: PayloadAction<{}>) => {
      state.value_3 = action.payload;
    },
    // gets the company previous two year financial data from the api
    getCompanyData_4: (state, action: PayloadAction<{}>) => {
      state.value_4 = action.payload;
    },
    // gets the company previous three year financial data from the api
    getCompanyData_5: (state, action: PayloadAction<{}>) => {
      state.value_5 = action.payload;
    },
    // gets the company previous four year financial data from the api
    getCompanyData_6: (state, action: PayloadAction<{}>) => {
      state.value_6 = action.payload;
    },
    // gets company stock data from the api
    getCompanyData_7: (state, action: PayloadAction<{}>) => {
      state.value_7 = action.payload;
    },
  },
});

// reducer workers to dispatch payload to create new immutable state objects
export const {
  getCompanyData_1,
  getCompanyData_2,
  getCompanyData_3,
  getCompanyData_4,
  getCompanyData_5,
  getCompanyData_6,
  getCompanyData_7,
} = selectorSlice.actions;

// current state display worker
export const selectorValue_1 = (state: RootState) => state.selector.value_1;
export const selectorValue_2 = (state: RootState) => state.selector.value_2;
export const selectorValue_3 = (state: RootState) => state.selector.value_3;
export const selectorValue_4 = (state: RootState) => state.selector.value_4;
export const selectorValue_5 = (state: RootState) => state.selector.value_5;
export const selectorValue_6 = (state: RootState) => state.selector.value_6;
export const selectorValue_7 = (state: RootState) => state.selector.value_7;

export default selectorSlice.reducer;
