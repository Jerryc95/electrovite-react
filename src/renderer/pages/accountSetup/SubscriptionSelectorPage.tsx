import React, { useEffect, useState } from 'react';

import SubscriptionSelector from '$renderer/components/SubscriptionSelector';
import '../../styles/subSelector.scss';
import { Subscription } from 'src/models/subscription';

interface SubscriptionSelectorPageProps {
  setSubscription: React.Dispatch<React.SetStateAction<Subscription | null>>;
  setCreationStep: React.Dispatch<React.SetStateAction<number>>;
  // setCustomer: React.Dispatch<React.SetStateAction<string>>;
  email: string,
}

const SubscriptionSelectorPage: React.FC<SubscriptionSelectorPageProps> = ({
  setSubscription,
  setCreationStep,
  // setCustomer,
  email,
}) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isMonthly, setIsMonthly] = useState(true);

  const filteredSubscriptions = subscriptions.filter((subscription) =>
    isMonthly
      ? subscription.billing_cycle === 'Monthly' ||
        subscription.billing_cycle === 'N/A'
      : subscription.billing_cycle === 'Yearly' ||
        subscription.billing_cycle === 'N/A',
  );

  const fetchSubscriptions = async () => {
    await fetch('https://flowplanr-production.up.railway.app/subscription')
      .then((response) => response.json())
      .then((data) => {
        setSubscriptions(data);
      });
  };

  const handleBackClick = () => {
    setCreationStep(0);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className='sub-selector-container'>
      <h1>Choose the right plan for you.</h1>
      <label className={`toggle-slider ${isMonthly ? 'monthly' : 'yearly'}`}>
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
            <li
              key={subscription.id}
            >
              <SubscriptionSelector
                subscription={subscription}
                planType={subscription.id == 1 ? 'free' : 'premium'}
                setSubscription={setSubscription}
                setCreationStep={setCreationStep}
                // setCustomer={setCustomer}
                email={email}
              />
            </li>
          ))}
      </ul>
      <button
        className={`subscription-back-button button-brand-darker-blue`}
        onClick={() => handleBackClick()}
      >
        Back
      </button>
    </div>
  );
};

export default SubscriptionSelectorPage;
