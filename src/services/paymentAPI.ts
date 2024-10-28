import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { StripePaymentMethod } from '../models/stripePaymentMethod';
import { StripeInvoice } from 'src/models/stripeInvoice';

export const paymentAPI = createApi({
  reducerPath: 'paymentAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://flowplanr-production.up.railway.app/payment' }),
  endpoints: (builder) => ({
    // CUSTOMER AND SUBSCRIPTIONS
    // Manage creating customers in the stripe API and their
    // subscriptions
    createCustomer: builder.mutation<string, string>({
      query: (email) => ({
        url: '/create-customer',
        method: 'POST',
        body: email,
      }),
    }),

    updateCustomer: builder.mutation<
      string,
      { name: string; address: string; customer: string }
    >({
      query: (body) => ({
        url: '/update-customer',
        method: 'POST',
        body: body,
      }),
    }),

    deleteCustomer: builder.mutation<string, string>({
      query: (customerID) => ({
        url: `/delete-customer/${customerID}`,
        method: 'delete',
      }),
    }),

    createSubscription: builder.mutation<
      string,
      { customer: string; priceID: string }
    >({
      query: (body) => ({
        url: '/create-subscription',
        method: 'POST',
        body: body,
      }),
    }),

    fetchSubscription: builder.mutation<string, string>({
      query: (id) => ({
        url: `/retrieve-subscription/${id}`,
        method: 'GET',
      }),
    }),

    updateSubscription: builder.mutation<string, object>({
      query: (body) => ({
        url: '/update-subscription',
        method: 'POST',
        body: body,
      }),
    }),

    resumeSubscription: builder.mutation<string, object>({
      query: (body) => ({
        url: '/resume-subscription',
        method: 'POST',
        body: body,
      }),
    }),

    cancelSubscription: builder.mutation<string, object>({
      query: (body) => ({
        url: '/cancel-subscription',
        method: 'POST',
        body: body,
      }),
    }),

    // PAYMENT METHODS
    fetchPaymentMethod: builder.mutation<
      StripePaymentMethod,
      { customer: string; id: string | null }
    >({
      query: (params) => ({
        url: `/retrieve-payment-method/${params.customer}/${params.id}`,
        method: 'GET',
      }),
    }),

    //INVOICES
    fetchPastInvoices: builder.query<StripeInvoice[], string | undefined>({
      query: (customer) => ({
        url: `/past-invoices/${customer}`,
        method: 'GET',
      }),
    }),
    fetchUpcomingInvoices: builder.query<StripeInvoice[], string | undefined>({
      query: (customer) => ({
        url: `/upcoming-invoices/${customer}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useFetchPaymentMethodMutation,
  useFetchPastInvoicesQuery,
  useFetchUpcomingInvoicesQuery,
} = paymentAPI;
