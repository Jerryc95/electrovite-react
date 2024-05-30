import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../../../../services/store';
import { updateSubscription } from '../../../../../services/subscriptionSlice';
import { Subscription } from 'src/models/subscription';
import { StripeSubscription } from 'src/models/stripeSubscription';
import { getUser } from 'src/services/accountSlice';

interface SubscriberFormProps {
  subscription: Subscription;
  setIsUpdatingPlan: React.Dispatch<React.SetStateAction<boolean>>;
  setViewingPlans: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessfullySubscribedAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReturningSubscriberForm: React.FC<SubscriberFormProps> = ({
  subscription,
  setIsUpdatingPlan,
  setViewingPlans,
  setSuccessfullySubscribedAlert,
}) => {
  const subscriptionState = useSelector(
    (state: RootState) => state.subscriptionReducer,
  );
  const user = useSelector(getUser);

  const dispatch = useDispatch();

  const getPlanColorClass = (plan: string | undefined) => {
    switch (plan) {
      case 'Starter':
        return 'starter';
      case 'Plus':
        return 'plus';
      case 'Pro':
        return 'pro';
      default:
        return '';
    }
  };

  const handleUpdatePlan = async () => {
    const url = 'http://localhost:3000/payment/resume-subscription';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentSubscriptionID: subscriptionState.stripeSubscription?.id,
          priceID: subscription.stripe_price_id,
          subscriptionID: subscription.id,
          accountID: user.account?.id,
        }),
      });
      const responseData = await response.json();

      const updatedStripeSubscription: StripeSubscription = {
        id: responseData.subscription.id,
        customer: responseData.subscription.customer,
        start_date: responseData.subscriptionstart_date,
        current_period_end: responseData.subscription.current_period_end,
        current_period_start: responseData.subscription.current_period_start,
        trial_end: responseData.subscription.trial_end,
        cancel_at: responseData.subscription.cancel_at,
        cancel_at_period_end: responseData.subscription.cancel_at_period_end,
        canceled_at: responseData.subscription.canceled_at,
        status: responseData.subscription.status,
        default_payment_method: responseData.subscription.default_payment_method,
      };

      const updatedSubscription = {
        subscription: subscription,
        stripeSubscription: updatedStripeSubscription,
        stripeCustomer: subscriptionState.stripeCustomer,
        previousSubscription: subscription,
        loading: subscriptionState.loading,
        error: subscriptionState.error,
      };

      dispatch(updateSubscription(updatedSubscription));

      setIsUpdatingPlan(false);
      setViewingPlans(false);
      setSuccessfullySubscribedAlert(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='subscription-update-container'>
      <div className='subscription-columns-container'>
        <div className='sub-selector-heading'>
          <h2>Updating Plan</h2>
          <button
            className='button-brand-purple close-button'
            onClick={() => setIsUpdatingPlan(false)}
          >
            close
          </button>
        </div>
        <div className='confirm-sub-container'>
          <div className='columns-row'>
            <div className='columns-row-section'>
              <h3>Current Plan</h3>
              <h2
                className={getPlanColorClass(
                  subscriptionState.subscription?.name,
                )}
              >
                {subscriptionState.subscription?.name}
              </h2>
              <h4>
                {subscriptionState.subscription?.id == 1 ? (
                  <div>FREE</div>
                ) : (
                  <div>
                    {subscriptionState.subscription?.price}/
                    {subscriptionState.subscription?.billing_cycle}
                  </div>
                )}
              </h4>
              <div className='sub-feature-list'>
                {subscriptionState.subscription?.features.map((feature) => (
                  <p className='plan-highlight'>
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className='check-icon'
                    />
                    {feature}
                  </p>
                ))}
              </div>
            </div>
            <FontAwesomeIcon
              className='fa-arrow'
              icon={faArrowRight}
              size='xl'
            />
            <div className='columns-row-section'>
              <h3>New Plan</h3>
              <h2 className={getPlanColorClass(subscription.name)}>
                {subscription.name}
              </h2>
              <h4>
                {subscription.id == 1 ? (
                  <div>FREE</div>
                ) : (
                  <div>
                    {subscription.price}/{subscription.billing_cycle}
                  </div>
                )}
              </h4>
              <div className='sub-feature-list'>
                {subscription.features.map((feature) => (
                  <p className='plan-highlight'>
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className='check-icon'
                    />
                    {feature}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <button
            className='button-brand-magenta confirm-button'
            onClick={handleUpdatePlan}
          >
            Update Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturningSubscriberForm;
