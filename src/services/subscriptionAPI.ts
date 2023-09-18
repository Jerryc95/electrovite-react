import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Subscription } from 'src/models/subscription';
import type { SubscribedAccount } from 'src/models/subscribedAccount';

export const subscriptionAPI = createApi({
  reducerPath: 'subscriptionAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'hpp://localhost:/3000/subscription' }),

  endpoints: (builder) => ({
    fetchSubscriptions: builder.mutation<Subscription, object>({
      query: (subcriptions) => ({
        url: '/',
        method: 'GET',
        body: subcriptions,
      }),
    }),

    createSubscribedAccount: builder.mutation<SubscribedAccount, object>({
      query: (subscribedAccount) => ({
        url: '/account/add',
        method: 'POST',
        body: subscribedAccount,
      }),
    }),
  }),
});

export const {
  useFetchSubscriptionsMutation,
  useCreateSubscribedAccountMutation,
} = subscriptionAPI;
