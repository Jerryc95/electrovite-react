import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Subscription } from '../../models/subscription';

import '../styles/subSelector.scss';

interface SubscriptionSelectorProps {
  setSubscription: React.Dispatch<React.SetStateAction<Subscription | null>>;
  setCreationStep: React.Dispatch<React.SetStateAction<number>>;
  subscription: Subscription;
  planType: string;
}

const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  setSubscription,
  setCreationStep,
  subscription,
  planType,
}) => {
  // const [createSubscriber] = useCreateSubscribedAccountMutation();
  const navigate = useNavigate();

  let colorClass = '';
  let buttonColorClass = '';
  let billing_cycle = '';

  switch (subscription.name) {
    case 'Starter':
      colorClass = 'brand-pink';
      buttonColorClass = 'button-brand-pink';
      break;
    case 'Plus':
      colorClass = 'brand-light-blue';
      buttonColorClass = 'button-brand-light-blue';
      break;
    case 'Pro':
      colorClass = 'brand-dark-purple';
      buttonColorClass = 'button-brand-dark-purple';
      break;
    default:
      colorClass = '';
      buttonColorClass = '';
  }

  switch (subscription.billing_cycle) {
    case 'N/A':
      billing_cycle = 'Free';
      break;
    case 'Monthly':
      billing_cycle = 'Per Month';
      break;
    case 'Yearly':
      billing_cycle = 'Per Year';
      break;
    default:
      billing_cycle = '';
  }

  const handlePlanSelection = () => {
    setSubscription(subscription)
    if (planType == 'free' && subscription !== null) {
      setCreationStep(3);
    } else {
      setCreationStep(2);
    }
  };

  return (
    <div className='subscription-detail-container'>
      <h2 className={`subscription-detail-name ${colorClass}`}>
        {subscription.name}
      </h2>

      <div className={`subscription-detail-price ${colorClass}`}>
        ${subscription.price}
      </div>
      <div className='subscription-detail-billing'>{billing_cycle}</div>
      <div className='subscription-detail-description'>
        {subscription.description}
      </div>
      <button
        className={`subscription-detail-button ${buttonColorClass}`}
        onClick={() => handlePlanSelection()}
      >
        Get Started
      </button>
      <ul className='subscription-detail-features'>
        {subscription.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionSelector;
