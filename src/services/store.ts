import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import accountSlice from './accountSlice';
import subscriptionSlice from './subscriptionSlice';
import paymentSlice from './paymentSlice';
import projectSlice from './projectSlice';
import recurringTaskSlice from './recurringTaskSlice';
import taskSlice from './taskSlice';
import { authAPI } from './authAPI';
import { profileAPI } from './profileAPI';
import { subscriptionAPI } from './subscriptionAPI';
import { paymentAPI } from './paymentAPI';
import { projectAPI } from './projectAPI';
import { taskAPI } from './taskAPI';
import { subtaskAPI } from './subtaskAPI';
import { recurringTaskAPI } from './recurringTaskAPI';
import { contactAPI } from './contactAPI';
import { bookkeepingAPI } from './bookkeepingAPI';
import contactSlice from './contactSlice';
import subtaskSlice from './subtaskSlice';
import bookkeepingSlice from './bookkeepingSlice';


export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  accountReducer: accountSlice,
  subscriptionReducer: subscriptionSlice,
  paymentReducer: paymentSlice,
  projectReducer: projectSlice,
  taskReducer: taskSlice,
  subtaskReducer: subtaskSlice,
  recurringTaskReducer: recurringTaskSlice,
  contactReducer: contactSlice,
  bookkeepingReducer: bookkeepingSlice,
  [authAPI.reducerPath]: authAPI.reducer,
  [profileAPI.reducerPath]: profileAPI.reducer,
  [subscriptionAPI.reducerPath]: subscriptionAPI.reducer,
  [paymentAPI.reducerPath]: paymentAPI.reducer,
  [projectAPI.reducerPath]: projectAPI.reducer,
  [taskAPI.reducerPath]: taskAPI.reducer,
  [subtaskAPI.reducerPath]: subtaskAPI.reducer,
  [recurringTaskAPI.reducerPath]: recurringTaskAPI.reducer,
  [contactAPI.reducerPath]: contactAPI.reducer,
  [bookkeepingAPI.reducerPath]: bookkeepingAPI.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  // blacklist: [
  //   authAPI.reducerPath,
  //   profileAPI.reducerPath,
  //   subscriptionAPI.reducerPath,
  //   paymentAPI.reducerPath,
  //   projectAPI.reducerPath,
  //   taskAPI.reducerPath,
  //   subtaskAPI.reducerPath,
  //   recurringTaskAPI.reducerPath,
  //   contactAPI.reducerPath,
  // ],
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
    recurringTaskAPI.middleware,
    contactAPI.middleware,
    bookkeepingAPI.middleware,
  ],
});

export default store;
