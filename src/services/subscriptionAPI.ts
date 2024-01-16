import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Subscription } from 'src/models/subscription';
import type { SubscriptionInfo } from 'src/models/subscriptionInfo';

export const subscriptionAPI = createApi({
  reducerPath: 'subscriptionAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/subscription' }),

  endpoints: (builder) => ({
    fetchSubscriptions: builder.mutation<Subscription, object>({
      query: (subcriptions) => ({
        url: '/',
        method: 'GET',
        body: subcriptions,
      }),
    }),

    createSubscriptionInfo: builder.mutation<SubscriptionInfo, object>({
      query: (subscriptionInfo) => ({
        url: '/account/add',
        method: 'POST',
        body: subscriptionInfo,
      }),
    }),

    fetchSubscriptionInfo: builder.mutation<SubscriptionInfo, number>({
      query: (id) => ({
        url: `/account/${id}`,
        method: 'GET'
      }),
    }),
  }),
});

export const {
  useFetchSubscriptionInfoMutation,
  useCreateSubscriptionInfoMutation,
} = subscriptionAPI;
