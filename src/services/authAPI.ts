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

    recoverAccount: builder.mutation<Account, object>({
      query: (account) => ({
        url: '/recover',
        method: 'POST',
        body: account,
      }),
    }),

    forceDeleteAccount: builder.mutation<null, object>({
      query: (account) => ({
        url: '/force-delete',
        method: 'DELETE',
        body: account,
      }),
    }),

    updateEmail: builder.mutation<
      { email: string },
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
    //////////////////////
    ////   2FA API  /////
    ////////////////////
    generateSecret: builder.mutation<
      {
        secret: string;
        recoveryCode: string;
        otpAuthUrl: string;
      },
      object
    >({
      query: (body) => ({
        url: '/security/generate-secret',
        method: 'POST',
        body: body,
      }),
    }),
    verifyToken: builder.mutation<
      {
        isValid: boolean;
      },
      object
    >({
      query: (body) => ({
        url: '/security/verify-token',
        method: 'POST',
        body: body,
      }),
    }),
    disableTwoFactor: builder.mutation<
      {
        isDisabled: boolean;
      },
      object
    >({
      query: (body) => ({
        url: '/security/disable-two-factor',
        method: 'PUT',
        body: body,
      }),
    }),
    ResetTwoFactor: builder.mutation<
      {
        isValid: boolean;
      },
      object
    >({
      query: (body) => ({
        url: '/security/recover',
        method: 'POST',
        body: body,
      }),
    }),

    /////////////////////////////////
    ////   email verification  /////
    ///////////////////////////////
    sendVerificationCode: builder.mutation<
      {
        isSent: boolean;
      },
      object
    >({
      query: (body) => ({
        url: '/send-verification-email',
        method: 'POST',
        body: body,
      }),
    }),
    verifyEmail: builder.mutation<
      {
        message: string;
        isValid: boolean;
      },
      object
    >({
      query: (body) => ({
        url: '/verify-email',
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const {
  useRegisterAccountMutation,
  useSignInAccountMutation,
  useSignOutAccountMutation,
  useDeleteAccountMutation,
  useForceDeleteAccountMutation,
  useRecoverAccountMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,

  useGenerateSecretMutation,
  useVerifyTokenMutation,
  useDisableTwoFactorMutation,
  useResetTwoFactorMutation,

  useSendVerificationCodeMutation,
  useVerifyEmailMutation,
} = authAPI;
