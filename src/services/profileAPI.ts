import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AccountProfile } from 'src/models/accountProfile';

export const profileAPI = createApi({
  reducerPath: 'profileAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/account' }),

  endpoints: (builder) => ({
    fetchProfile: builder.mutation<AccountProfile, number>({
      query: (id) => ({
        url: `${id}`,
        method: 'GET',
      }),
    }),

    updateProfile: builder.mutation<AccountProfile, AccountProfile>({
      query: (account) => ({
        url: `update/profile/${account.account_id}`,
        method: 'PUT',
        body: account,
      }),
    }),
  }),
});

export const { useFetchProfileMutation, useUpdateProfileMutation } = profileAPI;
