// The subscription slice includes all references for the Flowplanr database
// and the stripe's subscription data.

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { subscriptionAPI } from './subscriptionAPI';
import { SubscriptionInfo } from 'src/models/subscriptionInfo';
import { Subscription } from 'src/models/subscription';
import { StripeSubscription } from 'src/models/stripeSubscription';

interface subscriptionState {
  subscription: Subscription | null;
  stripeSubscription: StripeSubscription | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const inititalSubscriptionState: subscriptionState = {
  subscription: null,
  stripeSubscription: null,
  loading: 'idle',
  error: null,
};

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: inititalSubscriptionState,
  reducers: {
    clearSubscriptionInfo: () => inititalSubscriptionState,
    updateSubscription: (state, action: PayloadAction<subscriptionState>) => {
        state.subscription = action.payload.subscription
        state.stripeSubscription = action.payload.stripeSubscription
    },
  },
  extraReducers: (builder) => {
    //SUBSCRIPTION API
    builder.addMatcher(
      subscriptionAPI.endpoints.fetchSubscriptionInfo.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      subscriptionAPI.endpoints.fetchSubscriptionInfo.matchFulfilled,
      (state, action: PayloadAction<SubscriptionInfo>) => {
        state.loading = 'fulfilled';
        state.subscription = action.payload.subscription;
        state.stripeSubscription = action.payload.stripeSubscription;
      },
    );
  },
});

export const { clearSubscriptionInfo, updateSubscription } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
