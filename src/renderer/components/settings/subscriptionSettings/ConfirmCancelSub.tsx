import React from 'react';
import { useSelector } from 'react-redux';
// import {
//   getStripeCustomer,
// } from '../../../../services/subscriptionSlice';
// import { StripeSubscription } from 'src/models/stripeSubscription';

import { RootState } from '../../../../services/store';
// import { Subscription } from 'src/models/subscription';
import { useCancelSubscriptionMutation } from '../../../../services/subscriptionAPI';

interface ConfirmCancelSubProps {
  // stripe_sub_id: string | null | undefined;
  accountID: number | undefined;
  setIsCancelingSub: React.Dispatch<React.SetStateAction<boolean>>;
  setViewingPlans: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmCancelSub: React.FC<ConfirmCancelSubProps> = ({
  // stripe_sub_id,
  accountID,
  setIsCancelingSub,
  setViewingPlans,
}) => {
  const subscriptionState = useSelector(
    (state: RootState) => state.subscriptionReducer,
  );
  // const customer = useSelector(getStripeCustomer);
  // const dispatch = useDispatch();

  const [cancelSubscription] = useCancelSubscriptionMutation();

  const handleCancelSubClick = async () => {
    const data = {
      stripe_sub_id: subscriptionState.stripeSubscription?.id,
      accountID: accountID,
      previous_sub_id: subscriptionState.subscription?.id
    };
    cancelSubscription(data)
    // const url = `http://localhost:3000/payment/cancel-subscription`;
    // try {
    //   const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       accountID: accountID,
    //       stripe_sub_id: stripe_sub_id,
    //     }),
    //   });
    //   const responseData = await response.json();

    //   const updatedStripeSubscription: StripeSubscription = {
    //     id: responseData.id,
    //     customer: responseData.customer,
    //     start_date: responseData.subscriptionstart_date,
    //     current_period_end: responseData.current_period_end,
    //     current_period_start: responseData.current_period_start,
    //     trial_end: responseData.trial_end,
    //     cancel_at: responseData.cancel_at,
    //     cancel_at_period_end: responseData.cancel_at_period_end,
    //     canceled_at: responseData.canceled_at,
    //     status: responseData.status,
    //     default_payment_method: responseData.default_payment_method,
    //   };

    //   const starterSubscription: Subscription = {
    //     id: 1,
    //     name: 'Starter',
    //     description: 'Best for personal use and keeping tracking of work.',
    //     price: 0,
    //     billing_cycle: 'N/A',
    //     features: [
    //       'Up to 3 Projects',
    //       'Kanban Boards',
    //       'Lists',
    //       'Unlimited Tasks',
    //       'Unlimited Subtasks',
    //       'Summary Dashboard',
    //     ],
    //     stripe_price_id: 'N/A',
    //     tier: 1,
    //   };

    //   const cancelledSubscription = {
    //     subscription: starterSubscription,
    //     previousSubscription: subscriptionState.subscription,
    //     stripeSubscription: updatedStripeSubscription,
    //     stripeCustomer: customer,
    //     loading: subscriptionState.loading,
    //     error: subscriptionState.error,
    //   };
    //   dispatch(updateSubscription(cancelledSubscription));
      // setIsCancelingSub(false);
      // setViewingPlans(false);
    // } catch (error) {
    //   console.log(error);
    // }
    setIsCancelingSub(false);
    setViewingPlans(false);
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
