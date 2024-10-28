import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Subscription } from 'src/models/subscription';
import type { SubscriptionInfo } from 'src/models/subscriptionInfo';
import type { StripeSubscription } from 'src/models/stripeSubscription';

interface ICustomerPortalResponse {
  id: string;
  return_url: string;
  url: string;
}

export const subscriptionAPI = createApi({
  reducerPath: 'subscriptionAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://flowplanr-production.up.railway.app/subscription' }),

  endpoints: (builder) => ({
    fetchSubscriptions: builder.query<Subscription, object>({
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
        method: 'GET',
      }),
    }),

    updateAccount: builder.mutation<SubscriptionInfo, object>({
      query: (body) => ({
        url: '/update/account',
        method: 'PATCH',
        body: body,
      }),
    }),

    //STRIPE API FOR MANAGING CUSTOMERS AND SUBSCRIPTIONS VIA STRIPE
    createCustomer: builder.mutation<{ customer: string }, object>({
      query: (email) => ({
        url: '/stripe/create-customer',
        method: 'POST',
        body: email,
      }),
    }),

    updateCustomer: builder.mutation<
      string,
      { name: string; address: string; customer: string }
    >({
      query: (body) => ({
        url: '/stripe/update-customer',
        method: 'POST',
        body: body,
      }),
    }),

    deleteCustomer: builder.mutation<string, { customer: string }>({
      query: (params) => ({
        url: `/stripe/delete-customer/${params.customer}`,
        method: 'DELETE',
      }),
    }),

    fetchSubscription: builder.mutation<StripeSubscription, string>({
      query: (id) => ({
        url: `/stripe/retrieve-subscription/${id}`,
        method: 'GET',
      }),
    }),

    createSubscription: builder.mutation<
      {
        clientSecret: string;
        stripeSubscription: StripeSubscription;
        type: string;
      },
      { customer: string; priceID: string }
    >({
      query: (body) => ({
        url: '/stripe/create-subscription',
        method: 'POST',
        body: body,
      }),
    }),

    updateSubscription: builder.mutation<
      {
        subscription: Subscription;
        stripeSubscription: StripeSubscription;
        previousSubscription: Subscription;
      },
      object
    >({
      query: (body) => ({
        url: '/stripe/update-subscription',
        method: 'POST',
        body: body,
      }),
    }),

    resumeSubscription: builder.mutation<
      { stripeSubscription: StripeSubscription; subscription: Subscription },
      object
    >({
      query: (body) => ({
        url: '/stripe/resume-subscription',
        method: 'POST',
        body: body,
      }),
    }),

    cancelSubscription: builder.mutation<
      {
        subscription: Subscription;
        stripeSubscription: StripeSubscription;
      },
      object
    >({
      query: (body) => ({
        url: '/stripe/cancel-subscription',
        method: 'POST',
        body: body,
      }),
    }),
    createPortalSession: builder.mutation<ICustomerPortalResponse, object>({
      query: (body) => ({
        url: '/stripe/portal-session',
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const {
  useFetchSubscriptionInfoMutation,
  useCreateSubscriptionInfoMutation,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useCreateSubscriptionMutation,
  useFetchSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useResumeSubscriptionMutation,
  useCancelSubscriptionMutation,
  useUpdateAccountMutation,
  useCreatePortalSessionMutation,
} = subscriptionAPI;
