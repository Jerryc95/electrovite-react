import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';

import { Subscription } from 'src/models/subscription';
import StripePaymentForm from '$renderer/components/stripeAPI/StripePaymentForm';

interface SubscriberFormProps {
  subscription: Subscription;
  setIsUpdatingPlan: React.Dispatch<React.SetStateAction<boolean>>;
  setViewingPlans: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessfullySubscribedAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

function NewSubscriberForm({
  subscription,
  setIsUpdatingPlan,
  setViewingPlans,
  setSuccessfullySubscribedAlert,
}: SubscriberFormProps): JSX.Element {
  const [stripePromise, setStripePromise] = useState<any>();

  const options: StripeElementsOptions = {
    mode: 'subscription',
    amount: subscription.price * 100,
    currency: 'usd',
  };

  useEffect(() => {
    fetch('http://localhost:3000/payment/config').then(async (res) => {
      const { publishableKey } = await res.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  return (
    <div className='subscription-update-container'>
      <div className='subscription-columns-container'>
        {stripePromise ? (
          <div>
            <Elements stripe={stripePromise} options={options}>
              <StripePaymentForm
                subscription={subscription}
                setIsUpdatingPlan={setIsUpdatingPlan}
                setViewingPlans={setViewingPlans}
                setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
              />
            </Elements>
          </div>
        ) : (
          <div className='spinner-container'>
            {<h1>Loading Billing & Payment</h1>}
            <div className='spinner'></div>
            <button onClick={() => setIsUpdatingPlan(false)}>close</button>
          </div>
        )}
       
      </div>
    </div>
  );
}

export default NewSubscriberForm;
