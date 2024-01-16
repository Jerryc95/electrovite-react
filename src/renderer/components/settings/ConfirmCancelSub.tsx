import React from 'react';

import { StripeSubscription } from 'src/models/stripeSubscription';

interface ConfirmCancelSubProps {
  stripe_sub_id: string | null | undefined;
  accountID: number | undefined;
  setIsCancelingSub: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdatingPlan: React.Dispatch<React.SetStateAction<boolean>>;
  setStripeSubscriptionInfo: React.Dispatch<
    React.SetStateAction<StripeSubscription | null>
  >;
}

const ConfirmCancelSub: React.FC<ConfirmCancelSubProps> = ({
  stripe_sub_id,
  accountID,
  setIsCancelingSub,
  setUpdatingPlan,
  setStripeSubscriptionInfo,
}) => {
  const handleCancelSubClick = async () => {
    const url = `http://localhost:3000/payment/cancel-subscription`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountID: accountID,
          stripe_sub_id: stripe_sub_id,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      setStripeSubscriptionInfo(responseData);
      setIsCancelingSub(false);
      setUpdatingPlan(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseClick = () => {
    setIsCancelingSub(false);
  };

  return (
    <div className='subscription-update-container'>
      <div className='subscription-cancel-container'>
        <div className='cancel-sub-body'>
          <h2>Confirm Subscription Cancellation</h2>
          <p>
            Are you sure you want to cancel your subscription? You can stil
            access the premium features of FlowPlanr until your subscription
            ends. After cancellation, your account will be downgraded to the
            free starter tier.
            <br />
            <br />
            Please note: If you wish to regain access to premium features, you
            will need to resubscribe. This will initiate a new billing period.
          </p>
          <button
            className='button-brand-pink cancel-sub'
            onClick={handleCancelSubClick}
          >
            Confirm Cancellation
          </button>
          <button
            className='button-brand-purple cancel-sub'
            onClick={handleCloseClick}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancelSub;
