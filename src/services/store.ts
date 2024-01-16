import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import accountSlice from './accountSlice';
import { authAPI } from './authAPI';
import { profileAPI } from './profileAPI';
import { subscriptionAPI } from './subscriptionAPI';

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  accountReducer: accountSlice,
  [authAPI.reducerPath]: authAPI.reducer,
  [profileAPI.reducerPath]: profileAPI.reducer,
  [subscriptionAPI.reducerPath]: subscriptionAPI.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [authAPI.reducerPath, profileAPI.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    thunk,
    authAPI.middleware,
    profileAPI.middleware,
    subscriptionAPI.middleware,
  ],
});

export default store;
