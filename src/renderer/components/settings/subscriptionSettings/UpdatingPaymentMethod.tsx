import React, {useState, useEffect} from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';

interface UpdatingPaymentMethodProps {
  setShowingUpdatingPayment: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdatingPaymentMethod: React.FC<UpdatingPaymentMethodProps> = ({
  setShowingUpdatingPayment,
}) => {
    const [stripePromise, setStripePromise] = useState<any>();

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
            {/* <Elements stripe={stripePromise} options={options}>
              <StripePaymentForm
                subscription={subscription}
                customer={customer}
                setIsUpdatingPlan={setIsUpdatingPlan}
                setViewingPlans={setViewingPlans}
                setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
              />
            </Elements> */}
             <button onClick={() => setShowingUpdatingPayment(false)}>close</button>
          </div>
        ) : (
          <div className='spinner-container'>
            {<h1>Loading Billing & Payment</h1>}
            <div className='spinner'></div>
            <button onClick={() => setShowingUpdatingPayment(false)}>close</button>
          </div>
        )}
       
      </div>
    </div>
  );
};

export default UpdatingPaymentMethod;
