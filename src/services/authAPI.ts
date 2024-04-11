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

    deleteAccount: builder.mutation<Account, object>({
      query: (account) => ({
        url: '/delete',
        method: 'PATCH',
        body: account,
      }),
    }),

    updateEmail: builder.mutation<
      Account,
      { id: number | undefined; email: string }
    >({
      query: (account) => ({
        url: `/update/email/${account.id}`,
        method: 'PUT',
        body: account,
      }),
    }),

    updatePassword: builder.mutation<
      object,
      {
        id: number | undefined;
        email: string | undefined;
        password: string;
        newPassword: string;
      }
    >({
      query: (arg) => ({
        url: `/update/password/${arg.id}`,
        method: 'PUT',
        body: arg,
      }),
    }),
    forgotPassword: builder.mutation<
      string,
      {
        email: string;
        password: string;
      }
    >({
      query: (email) => ({
        url: '/forgot-password',
        method: 'POST',
        body: email,
      }),
    }),
  }),
});

export const {
  useRegisterAccountMutation,
  useSignInAccountMutation,
  useSignOutAccountMutation,
  useDeleteAccountMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
} = authAPI;
