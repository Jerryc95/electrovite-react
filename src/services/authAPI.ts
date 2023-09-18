import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Account } from 'src/models/account';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/auth' }),

  endpoints: (builder) => ({
    registerAccount: builder.mutation<Account, object>({
      query: (account) => ({
        url: '/register',
        method: 'POST',
        body: account,
      }),
    }),

    signInAccount: builder.mutation<Account, object>({
      query: (account) => ({
        url: '/signin',
        method: 'POST',
        body: account,
      }),
    }),

    signOutAccount: builder.mutation<Account, object>({
      query: (account) => ({
        url: '/signout',
        method: 'DELETE',
        body: account,
      }),
    }),
  }),
});

export const {
  useRegisterAccountMutation,
  useSignInAccountMutation,
  useSignOutAccountMutation,
} = authAPI;
