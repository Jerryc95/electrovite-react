import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AccountProfile } from 'src/models/accountProfile';
import { Account } from 'src/models/account';

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
  }),
  
});

export const { useFetchProfileMutation } = profileAPI;
