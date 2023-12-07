import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';

import StripePaymentForm from '$renderer/components/stripeAPI/StripePaymentForm';


interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: string;
  features: string[];
}

interface SubPlanPaymentPageProps {
  // setCreationStep: React.Dispatch<React.SetStateAction<number>>;
  subscription: Subscription | null;
}
const PUBLIC_TEST_KEY =
  'pk_test_51OJeOgCIB4VRcR8jkCatIAAzNwxGvQQZgm8v7tiklBr89ivfRAQTxYRYTcm0sQKJx4ze7dzNyBm33gbASV3I1FGH00TXNQGUpP';

const stripePromise = await loadStripe(PUBLIC_TEST_KEY);

export default function SubPlanPaymentPage() {
  // const [stripePromise, setStripePromise] = useState<Stripe | null>(null);

  const [clientSecret, setClientSecret] = useState('');

  const options = {
    clientSecret,
  };

  const subscription = {
    price: '4.99',
  };



  useEffect(() => {
    fetch('http://localhost:3000/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  return (
    <div>
      {clientSecret ? (
        
          <Elements stripe={stripePromise} options={options}>
            <StripePaymentForm />
            <button>secret</button>
          </Elements>
      
      ) : (
        <button>Test</button>
      )}
    </div>
  );
}

// export default SubPlanPaymentPage;

// const handleBackClick = () => {
//   setCreationStep(1);
// };

// const handlePaymentSubmition = () => {
//   setCreationStep(3);
// };
