import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';

import '../../styles/components/StripePaymentForm.scss';
import { StripeAddressElementOptions } from '@stripe/stripe-js';
import { StripeSubscription } from 'src/models/stripeSubscription';

interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: string;
  features: string[];
  stripe_price_id: string;
}

interface StripePaymentFormProps {
  setCreationStep: React.Dispatch<React.SetStateAction<number>>;
  subscription: Subscription | null;
  customer: string;
  setStripeSubscription: React.Dispatch<
    React.SetStateAction<StripeSubscription | null>
  >;
}

export default function StripePaymentForm({
  setCreationStep,
  subscription,
  customer,
  setStripeSubscription,
}: StripePaymentFormProps): JSX.Element {
  const [isLoading, setisLoading] = useState(false);
  // const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const handleBackClick = () => {
    const url = `http://localhost:3000/payment/delete-customer/${customer.toString()}`;
    try {
      fetch(url, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log(error);
    }
    setCreationStep(1);
  };

  const handleSubcribe = async () => {
    // event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const addressElement = elements.getElement('address');
    if (!addressElement) {
      return;
    }

    const { complete, value } = await addressElement.getValue();

    if (!complete) {
      // set an alert message here
      return;
    }

    try {
      const addressResponse = await fetch(
        'http://localhost:3000/payment/update-customer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer: customer.toString(),
            name: value.name,
            address: value.address,
          }),
        },
      );
      const addressData = await addressResponse.json();
    } catch (error) {
      console.log(error);
    }

    setisLoading(true);
    try {
      if (subscription) {
        const subscribeResponse = await fetch(
          'http://localhost:3000/payment/create-subscription',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customer: customer.toString(),
              priceID: subscription.stripe_price_id.toString(),
            }),
          },
        );

        const subResponseData = await subscribeResponse.json();

        console.log(subResponseData)

        const newSubscription: StripeSubscription = {
          id: subResponseData.subscription.id,
          customer: subResponseData.subscription.customer,
          start_date: subResponseData.subscription.start_date,
          current_period_end: subResponseData.subscription.current_period_end,
          current_period_start: subResponseData.subscription.current_period_start,
          trial_end: subResponseData.subscription.trial_end,
          cancel_at: subResponseData.subscription.cancel_at,
          cancel_at_period_end: subResponseData.subscription.cancel_at_period_end,
          canceled_at: subResponseData.subscription.canceled_at,
          status: subResponseData.subscription.status,
        };

        console.log(newSubscription)
        setStripeSubscription(newSubscription);
        elements.submit();

        const confirmIntent =
          subResponseData.type === 'setup'
            ? stripe.confirmSetup
            : stripe.confirmPayment;

        const { error } = await confirmIntent({
          elements: elements,
          clientSecret: subResponseData.clientSecret,
          confirmParams: {
            return_url: 'http://localhost:5173/creating-account',
          },
          redirect: 'if_required',
        });

        if (error) {
          console.log(error);
        } else {
          // Your customer is redirected to your `return_url`. For some payment
          // methods like iDEAL, your customer is redirected to an intermediate
          // site first to authorize the payment, then redirected to the `return_url`.
        }
        setCreationStep(3);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addressOptions: StripeAddressElementOptions = {
    mode: 'billing',
  };

  return (
    <div className='payment-form-container'>
      <h1>Billing Details</h1>
      <form id='payment-form'>
        <div className='row'>
          <div className='form-section'>
            <h2>Plan Summary</h2>
            <h3>Plan: {subscription?.name}</h3>
            <h3>
              Price: {subscription?.price}/{subscription?.billing_cycle}
            </h3>
            <ul>
              {subscription?.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className='form-section'>
            <h2>Billing Address</h2>
            <AddressElement options={addressOptions} />
          </div>
          <div className='form-section'>
            <h2>Payment Method</h2>
            <PaymentElement />
          </div>
        </div>
        <div className='row'>
          <button
            className='button-brand-dark-purple'
            onClick={handleBackClick}
          >
            Back
          </button>
          <button
            className='button-brand-pink'
            disabled={isLoading || !stripe || !elements}
            onClick={handleSubcribe}
          >
            Subscribe
          </button>
        </div>
      </form>
      <p className='payment-disclaimer'>
        Every plan comes with a 7-day free trial. Explore our features and see
        how FlowPlanr can benefit you. After the trial, you'll be automatically
        charged based on your selected plan.
      </p>
      <p className='payment-disclaimer'>
        All payments on this platform are securely processed and handled by our
        trusted payment partner, Stripe. Stripe is a secure and widely-used
        online payment processing service that ensures the confidentiality and
        integrity of your payment information. We do not store any sensitive
        payment details on our servers. Your transactions are encrypted and
        protected by industry-standard security measures. By making a payment,
        you acknowledge that your transaction will be processed through Stripe's
        secure payment gateway.
      </p>
      <p className='payment-disclaimer'>
        Stripe collects and processes personal data, including identifying
        information about the devices that connect to its services. Stripe uses
        this information to operate and improve the services it provides to us,
        including for fraud detection and prevention. You can learn more about
        Stripe and its processing activities via privacy policy at
        https://stripe.com/privacy.
      </p>
      {isLoading && (
         <div className='spinner-dimmed-container'>
         <div className='spinner'></div>
       </div>
      )}
    </div>
  );
}

// export default StripePaymentForm;
