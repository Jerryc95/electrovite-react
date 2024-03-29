import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { StripePaymentMethod } from '../models/stripePaymentMethod';

export const paymentAPI = createApi({
  reducerPath: 'paymentAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/payment/' }),
  endpoints: (builder) => ({
    fetchPaymentMethod: builder.mutation<
      StripePaymentMethod,
      { customer: string; id: string | null }
    >({
      query: (params) => ({
        url: `retrieve-payment-method/${params.customer}/${params.id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useFetchPaymentMethodMutation } = paymentAPI;
