// The subscription slice includes all references for the Flowplanr database
// and the stripe's subscription data.

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { subscriptionAPI } from './subscriptionAPI';
import { SubscriptionInfo } from 'src/models/subscriptionInfo';
import { Subscription } from 'src/models/subscription';
import { StripeSubscription } from 'src/models/stripeSubscription';
import { RootState } from './store';

interface subscriptionState {
  subscription: Subscription | null;
  previousSubscription: Subscription | null;
  stripeSubscription: StripeSubscription | null;
  stripeCustomer: string;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const inititalSubscriptionState: subscriptionState = {
  subscription: null,
  previousSubscription: null,
  stripeSubscription: null,
  stripeCustomer: '',
  loading: 'idle',
  error: null,
};

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: inititalSubscriptionState,
  reducers: {
    clearSubscriptionInfo: () => inititalSubscriptionState,
    updateSubscription: (state, action: PayloadAction<subscriptionState>) => {
      state.subscription = action.payload.subscription;
      state.stripeSubscription = action.payload.stripeSubscription;
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
        state.stripeCustomer = action.payload.stripeSubscription.customer;
        state.previousSubscription = action.payload.previousSubscription;
      },
    );

    builder.addMatcher(
      subscriptionAPI.endpoints.updateAccount.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      subscriptionAPI.endpoints.updateAccount.matchFulfilled,
      (state, action: PayloadAction<SubscriptionInfo>) => {
        state.loading = 'pending';
        // state.subscription = action.payload.subscription;
        // state.stripeSubscription = action.payload.stripeSubscription;
        // state.stripeCustomer = action.payload.stripeSubscription.customer;
        // state.previousSubscription = action.payload.previousSubscription;
      },
    );


    // CUSTOMER AND STRIPE API
    builder.addMatcher(
      subscriptionAPI.endpoints.createCustomer.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      subscriptionAPI.endpoints.createCustomer.matchFulfilled,
      (state, action: PayloadAction<{ customer: string }>) => {
        state.loading = 'fulfilled';
        const customer = action.payload.customer;
        state.stripeCustomer = customer;
      },
    );
    builder.addMatcher(
      subscriptionAPI.endpoints.updateCustomer.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      subscriptionAPI.endpoints.createSubscription.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      subscriptionAPI.endpoints.createSubscription.matchFulfilled,
      (
        state,
        action: PayloadAction<{
          clientSecret: string;
          stripeSubscription: StripeSubscription;
          type: string;
        }>,
      ) => {
        state.loading = 'fulfilled';
        state.stripeSubscription = action.payload.stripeSubscription
      },
    );

    builder.addMatcher(
      subscriptionAPI.endpoints.updateSubscription.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      subscriptionAPI.endpoints.updateSubscription.matchFulfilled,
      (
        state,
        action: PayloadAction<{
          subscription: Subscription;
          previousSubscription: Subscription;
          stripeSubscription: StripeSubscription;
        }>,
      ) => {
        state.loading = 'fulfilled';
        state.previousSubscription = state.subscription;
        state.subscription = action.payload.subscription;
        state.stripeSubscription = action.payload.stripeSubscription;
      },
    );

    builder.addMatcher(
      subscriptionAPI.endpoints.cancelSubscription.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      subscriptionAPI.endpoints.cancelSubscription.matchFulfilled,
      (
        state,
        action: PayloadAction<{
          subscription: Subscription;
          stripeSubscription: StripeSubscription;
        }>,
      ) => {
        state.loading = 'fulfilled';
        state.previousSubscription = state.subscription;
        state.subscription = action.payload.subscription;
        state.stripeSubscription = action.payload.stripeSubscription;
      },
    );
  },
});

export const getSubscription = (state: RootState) =>
  state.subscriptionReducer.subscription;
export const getStripeCustomer = (state: RootState) =>
  state.subscriptionReducer.stripeCustomer;
export const getStripeSubscription = (state: RootState) =>
  state.subscriptionReducer.stripeSubscription;

export const { clearSubscriptionInfo, updateSubscription } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
