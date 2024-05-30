import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../services/store';
import { Subscription } from 'src/models/subscription';
import SubDetailColumn from './SubDetailColumn';
import ConfirmCancelSub from './ConfirmCancelSub';

interface SubscriptionUpdateProps {
  setViewingPlans: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessfullySubscribedAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubscriptionUpdate: React.FC<SubscriptionUpdateProps> = ({
  setViewingPlans,
  setSuccessfullySubscribedAlert,
}) => {
  const subscriptionState = useSelector(
    (state: RootState) => state.subscriptionReducer,
  );
  const accountState = useSelector((state: RootState) => state.accountReducer);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isMonthly, setIsMonthly] = useState(true);
  const [isCancelingSub, setIsCancelingSub] = useState(false);

  const filteredSubscriptions = subscriptions.filter((subscription) =>
    isMonthly
      ? subscription.billing_cycle === 'Monthly' ||
        subscription.billing_cycle === 'N/A'
      : subscription.billing_cycle === 'Yearly' ||
        subscription.billing_cycle === 'N/A',
  );
  
  const handleCancelSubClick = () => {
    setIsCancelingSub(true);
  };

  const fetchSubscriptions = async () => {
    await fetch('http://localhost:3000/subscription')
      .then((response) => response.json())
      .then((data) => {
        setSubscriptions(data);
      });
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className='subscription-update-container'>
      <div className='subscription-columns-container'>
        <div className='sub-selector-heading'>
          <h2>Update your plan</h2>
          <button
            className='button-brand-dark-purple close-button'
            onClick={() => setViewingPlans(false)}
          >
            close
          </button>
        </div>
        <div className='sub-selector-container'>
          <label
            className={`toggle-slider ${isMonthly ? 'monthly' : 'yearly'}`}
          >
            <input
              type='checkbox'
              checked={isMonthly}
              onChange={() => setIsMonthly(!isMonthly)}
            />
            <span className='slider'></span>
            <span className={`label-monthly ${isMonthly ? 'active' : ''}`}>
              Monthly
            </span>
            <span className={`label-yearly ${!isMonthly ? 'active' : ''}`}>
              Yearly
            </span>
          </label>
          <ul className='subscription-columns'>
            {filteredSubscriptions
              .sort((a, b) => a.id - b.id)
              .map((subscription) => (
                <li key={subscription.id}>
                  <SubDetailColumn
                    subscription={subscription}
                    setViewingPlans={setViewingPlans}
                    setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
                  />
                </li>
              ))}
          </ul>
          {subscriptionState.subscription?.name !== 'Starter' &&
            subscriptionState.stripeSubscription?.status !== 'canceled' && (
              <button
                className='button-brand-pink cancel-sub'
                onClick={handleCancelSubClick}
              >
                Cancel Subscription
              </button>
            )}

          {isCancelingSub && (
            <ConfirmCancelSub
              stripe_sub_id={subscriptionState.stripeSubscription?.id}
              accountID={accountState.account?.id}
              setIsCancelingSub={setIsCancelingSub}
              setViewingPlans={setViewingPlans}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpdate;
