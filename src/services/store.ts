import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import accountSlice from './accountSlice';
import subscriptionSlice from './subscriptionSlice';
import paymentSlice from './paymentSlice';
import projectSlice from './projectSlice';
import taskSlice from './taskSlice';
import { authAPI } from './authAPI';
import { profileAPI } from './profileAPI';
import { subscriptionAPI } from './subscriptionAPI';
import { paymentAPI } from './paymentAPI';
import { projectAPI } from './projectAPI';
import { taskAPI } from './taskAPI';
import { subtaskAPI } from './subtaskAPI';

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  accountReducer: accountSlice,
  subscriptionReducer: subscriptionSlice,
  paymentReducer: paymentSlice,
  projectReducer: projectSlice,
  taskReducer: taskSlice,
  [authAPI.reducerPath]: authAPI.reducer,
  [profileAPI.reducerPath]: profileAPI.reducer,
  [subscriptionAPI.reducerPath]: subscriptionAPI.reducer,
  [paymentAPI.reducerPath]: paymentAPI.reducer,
  [projectAPI.reducerPath]: projectAPI.reducer,
  [taskAPI.reducerPath]: taskAPI.reducer,
  [subtaskAPI.reducerPath]: subtaskAPI.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    authAPI.reducerPath,
    profileAPI.reducerPath,
    subscriptionAPI.reducerPath,
    paymentAPI.reducerPath,
    projectAPI.reducerPath,
    taskAPI.reducerPath,
    subtaskAPI.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    thunk,
    authAPI.middleware,
    profileAPI.middleware,
    subscriptionAPI.middleware,
    paymentAPI.middleware,
    projectAPI.middleware,
    taskAPI.middleware,
    subtaskAPI.middleware,
  ],
});

export default store;
