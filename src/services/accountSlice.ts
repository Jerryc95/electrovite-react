// The account slice includes references to both the authAPI and profileAPI.
// The authAPI handles registering, signing in and signing out. The profileAPI
// handles all user preferences such as display name and business info.

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { authAPI } from './authAPI';
import { profileAPI } from './profileAPI';
import { AccountProfile } from 'src/models/accountProfile';
import { Account } from 'src/models/account';

interface accountState {
  account: Account | null;
  accountProfile: AccountProfile | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const initialState: accountState = {
  account: null,
  accountProfile: null,
  loading: 'idle',
  error: null,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    resetAccountState: () => initialState,
  },

  extraReducers: (builder) => {
    //AUTH API
    builder.addMatcher(
      authAPI.endpoints.registerAccount.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      authAPI.endpoints.registerAccount.matchFulfilled,
      (state, action: PayloadAction<Account>) => {
        state.loading = 'fulfilled';
        state.account = action.payload;
      },
    );

    builder.addMatcher(
      authAPI.endpoints.signInAccount.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      authAPI.endpoints.signInAccount.matchFulfilled,
      (state, action: PayloadAction<Account>) => {
        state.loading = 'fulfilled';
        state.account = action.payload;
      },
    );

    builder.addMatcher(
      authAPI.endpoints.signOutAccount.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      authAPI.endpoints.signOutAccount.matchFulfilled,
      (state) => {
        state.loading = initialState.loading;
        state.account = initialState.account;
        state.accountProfile = initialState.accountProfile
        state.error = initialState.error
      },
    );

    //PROFILE API
    builder.addMatcher(
      profileAPI.endpoints.fetchProfile.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      profileAPI.endpoints.fetchProfile.matchFulfilled,
      (state, action: PayloadAction<AccountProfile>) => {
        state.loading = "fulfilled";
        state.accountProfile = action.payload;
      },
    );
  },
});

export const { resetAccountState } = accountSlice.actions;
export default accountSlice.reducer;
