import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';

import StripePaymentForm from '$renderer/components/stripeAPI/StripePaymentForm';
import { StripeSubscription } from 'src/models/stripeSubscription';
import { Subscription } from 'src/models/subscription';

interface SubPlanPaymentPageProps {
  setCreationStep: React.Dispatch<React.SetStateAction<number>>;
  subscription: Subscription | null;
  setStripeSubscription: React.Dispatch<
    React.SetStateAction<StripeSubscription | null>
  >;
}

function SubPlanPaymentPage({
  setCreationStep,
  subscription,
  setStripeSubscription,
}: SubPlanPaymentPageProps): JSX.Element {
  const [stripePromise, setStripePromise] = useState<any>();

  const options: StripeElementsOptions = {
    mode: 'subscription',
    amount: subscription!.price * 100,
    currency: 'usd',
  };

  useEffect(() => {
    fetch('https://flowplanr-production.up.railway.app/payment/config').then(async (res) => {
      const { publishableKey } = await res.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  return (
    <div>
      {stripePromise ? (
        <Elements stripe={stripePromise} options={options}>
          <StripePaymentForm
            setCreationStep={setCreationStep}
            subscription={subscription}
            setStripeSubscription={setStripeSubscription}
          />
        </Elements>
      ) : (
        <div className='spinner-container'>
          {<h1>Loading Billing & Payment</h1>}
          <div className='spinner'></div>
        </div>
      )}
    </div>
  );
}

export default SubPlanPaymentPage;
