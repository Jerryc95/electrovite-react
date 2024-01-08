import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';

import StripePaymentForm from '$renderer/components/stripeAPI/StripePaymentForm';

interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: string;
  features: string[];
  stripe_price_id: string;
}

interface SubPlanPaymentPageProps {
  setCreationStep: React.Dispatch<React.SetStateAction<number>>;
  subscription: Subscription | null;
  customer: string;
}

function SubPlanPaymentPage({
  setCreationStep,
  subscription,
  customer,
}: SubPlanPaymentPageProps): JSX.Element {
  const [stripePromise, setStripePromise] = useState<any>();
  const [clientSecret, setClientSecret] = useState('');

  // const options: StripeElementsOptions = {
  //   clientSecret,
  // };

  const options: StripeElementsOptions = {
    mode: 'subscription',
    amount: subscription!.price * 100,
    currency: 'usd',
  };

  // const subscription = {
  //   price: '4.99',
  // };

  // const handleBackClick = () => {
  //   setCreationStep(1);
  // };

  // const handlePaymentSubmit = () => {
  //   setCreationStep(3);
  // };

  useEffect(() => {
    fetch('http://localhost:3000/payment/config').then(async (res) => {
      const { publishableKey } = await res.json();
      // setPublicKey(publishableKey)
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  // useEffect(() => {
  //   fetch('http://localhost:3000/payment/create-payment-intent', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ subscription }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret.client_secret));
  // }, []);

  return (
    <div>
      {stripePromise ? (
        <Elements stripe={stripePromise} options={options}>
          <StripePaymentForm
            setCreationStep={setCreationStep}
            subscription={subscription}
            customer={customer}
          />
        </Elements>
      ) : (
        <div className='spinner-container'>
          {<h1>Loading Billing & Payment</h1>}
          <div className='spinner'></div>
          {/* add back button */}
        </div>
      )}
    </div>
  );
}

export default SubPlanPaymentPage;
