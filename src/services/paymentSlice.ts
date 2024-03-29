// The payment slice is used to fetch and update the customer's payment method
//  and address from the stripe API

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StripePaymentMethod } from '../models/stripePaymentMethod';
import { paymentAPI } from './paymentAPI';

interface paymentState {
  payment: StripePaymentMethod | null;
  // address: StripeAddress | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const inititalPaymentState: paymentState = {
  payment: null,
  loading: 'idle',
  error: null,
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState: inititalPaymentState,
  reducers: {
    clearPaymentState: () => inititalPaymentState,
    updatePaymentMethod: (state, action: PayloadAction<StripePaymentMethod>) => {
      state.payment = action.payload;
    },
  },

  extraReducers: (builder) => {
    //SUBSCRIPTION API
    builder.addMatcher(
      paymentAPI.endpoints.fetchPaymentMethod.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      paymentAPI.endpoints.fetchPaymentMethod.matchFulfilled,
      (state, action: PayloadAction<StripePaymentMethod>) => {
        state.loading = 'fulfilled';
        state.payment = action.payload;
      },
    );
  },
});

export const {clearPaymentState} = paymentSlice.actions
export default paymentSlice.reducer;
