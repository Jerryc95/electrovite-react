import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { StripeSubscription } from 'src/models/stripeSubscription';
import { RootState } from '../../../services/store';
import { Subscription } from 'src/models/subscription';
import SubDetailColumn from './SubDetailColumn';
import ConfirmCancelSub from './ConfirmCancelSub';

interface SubscriptionUpdateProps {
  setUpdatingPlan: React.Dispatch<React.SetStateAction<boolean>>;
  setStripeSubscriptionInfo: React.Dispatch<
    React.SetStateAction<StripeSubscription | null>
  >;
  stripeSubcriptionInfo: StripeSubscription | null;
}

const SubscriptionUpdate: React.FC<SubscriptionUpdateProps> = ({
  setUpdatingPlan,
  setStripeSubscriptionInfo,
  stripeSubcriptionInfo,
}) => {
  const accountState = useSelector((state: RootState) => state.accountReducer);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription>();
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
    console.log(stripeSubcriptionInfo)
  };

  const fetchSubscriptions = async () => {
    await fetch('http://localhost:3000/subscription')
      .then((response) => response.json())
      .then((data) => {
        setSubscriptions(data);
      });
  };

  const fetchCurrentSubscription = async () => {
    await fetch(
      `http://localhost:3000/subscription/${accountState.subscriptionInfo?.id}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setCurrentSubscription(data);
      });
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  return (
    <div className='subscription-update-container'>
      <div className='subscription-columns-container'>
        <div className='sub-selector-heading'>
          <h2>Update your plan</h2>
          <button
            className='button-brand-dark-purple close-button'
            onClick={() => setUpdatingPlan(false)}
          >
            close
          </button>
        </div>
        <div className='sub-selector-container'>
          {/* <h2>
            Current Plan: {currentSubscription?.name.toUpperCase()}{' '}
            {currentSubscription?.billing_cycle}
          </h2> */}
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
                    currentSubscription={
                      currentSubscription ? currentSubscription : subscription
                    }
                  />
                </li>
              ))}
          </ul>

          {currentSubscription?.name !== 'starter' &&
            stripeSubcriptionInfo?.status !== 'canceled' && (
              <button
                className='button-brand-pink cancel-sub'
                onClick={handleCancelSubClick}
              >
                Cancel Subscription
              </button>
            )}
          {isCancelingSub && (
            <ConfirmCancelSub
              stripe_sub_id={accountState.subscriptionInfo?.stripe_sub_id}
              accountID={accountState.account?.id}
              setIsCancelingSub={setIsCancelingSub}
              setUpdatingPlan={setUpdatingPlan}
              setStripeSubscriptionInfo={setStripeSubscriptionInfo}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpdate;
