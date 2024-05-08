// The account slice includes references to both the authAPI and profileAPI.
// The authAPI handles registering, signing in and signing out. The profileAPI
// handles all user preferences such as display name and business info.

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { authAPI } from './authAPI';
import { profileAPI } from './profileAPI';
import { AccountProfile } from 'src/models/accountProfile';
import { Account } from 'src/models/account';

interface accountState {
  account: Account | null;
  accountProfile: AccountProfile | null;
  selectedPage: string;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const initialAccountState: accountState = {
  account: null,
  accountProfile: null,
  selectedPage: 'home',
  loading: 'idle',
  error: null,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState: initialAccountState,
  reducers: {
    resetAccountState: () => initialAccountState,
    updateProfileState: (state, action: PayloadAction<AccountProfile>) => {
      state.accountProfile = action.payload;
    },
    updateEmailState: (state, action: PayloadAction<string>) => {
      if (state.account != null) {
        state.account.email = action.payload;
      }
    },
    selectPage: (state, action: PayloadAction<string>) => {
      state.selectedPage = action.payload;
    },
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
        state.loading = initialAccountState.loading;
        state.account = initialAccountState.account;
        state.accountProfile = initialAccountState.accountProfile;
        state.error = initialAccountState.error;
      },
    );
    builder.addMatcher(
      authAPI.endpoints.deleteAccount.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      authAPI.endpoints.deleteAccount.matchFulfilled,
      (state) => {
        state.loading = initialAccountState.loading;
        state.account = initialAccountState.account;
        state.accountProfile = initialAccountState.accountProfile;
        state.error = initialAccountState.error;
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
        state.loading = 'fulfilled';
        state.accountProfile = action.payload;
      },
    );
  },
});

export const selectedAccount = (state: RootState) => state.accountReducer;

export const {
  resetAccountState,
  updateProfileState,
  updateEmailState,
  selectPage,
} = accountSlice.actions;
export default accountSlice.reducer;
