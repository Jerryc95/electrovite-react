import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../../../../services/store';
import { Subscription } from 'src/models/subscription';
// import { updateSubscription } from '../../../../../services/subscriptionSlice';
// import { StripeSubscription } from 'src/models/stripeSubscription';
import { getUser } from '../../../../../services/accountSlice';
import {
  useCancelSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from '../../../../../services/subscriptionAPI';

interface SubscriberFormProps {
  subscription: Subscription;
  setIsUpdatingPlan: React.Dispatch<React.SetStateAction<boolean>>;
  setViewingPlans: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessfullySubscribedAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExistingSubscriberForm: React.FC<SubscriberFormProps> = ({
  subscription,
  setIsUpdatingPlan,
  setViewingPlans,
  setSuccessfullySubscribedAlert,
}) => {
  const subscriptionState = useSelector(
    (state: RootState) => state.subscriptionReducer,
  );
  const user = useSelector(getUser);
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();

  // const dispatch = useDispatch();

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

  const handleUpdatePlan = () => {
    if (subscription.id !== 1) {
      const data = {
        stripeSubID: subscriptionState.stripeSubscription?.id,
        priceID: subscription.stripe_price_id,
        subscriptionID: subscription.id,
        previousSubID: subscriptionState.subscription?.id,
        accountID: user.account?.id,
      };
      updateSubscription(data);
    } 
    else {
      const data = {
        stripe_sub_id: subscriptionState.stripeSubscription?.id,
        accountID: user.account?.id,
        previous_sub_id: subscriptionState.subscription?.id,
      };
      console.log(data);
      cancelSubscription(data)
    }

    setIsUpdatingPlan(false);
    setViewingPlans(false);
    setSuccessfullySubscribedAlert(true);
  };


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
                  <p key={feature} className='plan-highlight'>
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
                  <p key={feature} className='plan-highlight'>
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

export default ExistingSubscriberForm;
