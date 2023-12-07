import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function StripePaymentForm() {
  const [success, setSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubcribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('stripe:', stripe, 'elements:', elements);
      return;
    }

    console.log('stripe:', stripe, 'elements:', elements);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: 'John Doe',
      },
    });

    //   Handle the result or error.
    if (error) {
      console.error('error:', error);
    } else {
      console.log(paymentMethod);
    }
  };


  return (
    <div className='payment-form-container'>
      <form onSubmit={handleSubcribe}>
        <div className='row'>
          <CardElement />
        </div>
        <button>Subscribe</button>
      </form>
    </div>
  );
}


// export default StripePaymentForm;
