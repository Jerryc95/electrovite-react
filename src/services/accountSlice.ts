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
  signedIn: boolean;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
  deletedAt: Date | null;
}

const initialAccountState: accountState = {
  account: null,
  accountProfile: null,
  selectedPage: 'home',
  signedIn: false,
  loading: 'idle',
  error: null,
  deletedAt: null,
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
    setSignIn: (state, action: PayloadAction<boolean>) => {
      state.signedIn = action.payload;
    },
    setTwoFactorEnabled: (state, action: PayloadAction<boolean>) => {
      if (state.account) {
        state.account.two_factor_enabled = action.payload;
      }
    },
    clearAccountError: (state) => {
      state.error = null;
      state.deletedAt = null;
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
        if (action.payload.is_deleted == true) {
          state.error = 'Account Deleted';
          state.deletedAt = action.payload.deleted_at;
        }
        if (action.payload.is_deleted == false) {
          state.account = action.payload;
        }
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
        state.selectedPage = initialAccountState.selectedPage;
        state.signedIn = initialAccountState.signedIn;
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
        state.selectedPage = initialAccountState.selectedPage;
        state.signedIn = initialAccountState.signedIn;
        state.accountProfile = initialAccountState.accountProfile;
        state.error = initialAccountState.error;
      },
    );

    builder.addMatcher(
      authAPI.endpoints.recoverAccount.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      authAPI.endpoints.recoverAccount.matchFulfilled,
      (state, action: PayloadAction<Account>) => {
        state.loading = 'fulfilled';
        state.account = action.payload;
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

    builder.addMatcher(
      profileAPI.endpoints.updateProfile.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      profileAPI.endpoints.updateProfile.matchFulfilled,
      (state, action: PayloadAction<AccountProfile>) => {
        state.loading = 'fulfilled';
        state.accountProfile = action.payload;
        console.log(action.payload);
      },
    );
  },
});

export const getUser = (state: RootState) => state.accountReducer;

export const {
  resetAccountState,
  updateProfileState,
  updateEmailState,
  selectPage,
  setSignIn,
  setTwoFactorEnabled,
} = accountSlice.actions;
export default accountSlice.reducer;
