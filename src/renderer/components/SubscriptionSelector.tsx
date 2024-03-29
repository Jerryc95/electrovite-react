import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

import { Subscription } from '../../models/subscription';

import '../styles/subSelector.scss';

interface SubscriptionSelectorProps {
  setSubscription: React.Dispatch<React.SetStateAction<Subscription | null>>;
  setCreationStep: React.Dispatch<React.SetStateAction<number>>;
  setCustomer: React.Dispatch<React.SetStateAction<string>>;
  subscription: Subscription;
  planType: string;
  email: string;
}

const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  setSubscription,
  setCreationStep,
  setCustomer,
  subscription,
  planType,
  email,
}) => {
  // const [createSubscriber] = useCreateSubscribedAccountMutation();
  // const navigate = useNavigate();


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

  const handlePlanSelection = async () => {
    setSubscription(subscription);
    try {
      const response = await fetch('http://localhost:3000/payment/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              email: email,
            }),
      })
      const responseData = await response.json()
      setCustomer(responseData.data)
    } catch (error) {
      console.log(error)
    }
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
