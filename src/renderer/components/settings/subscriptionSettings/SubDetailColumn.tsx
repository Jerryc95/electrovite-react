import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../services/store';
import { Subscription } from 'src/models/subscription';
import ExistingAccountSubscribeForm from './ExistingAccountSubscribeForm';

interface SubDetailColumnProps {
  subscription: Subscription;
  customer: string;
  setViewingPlans: React.Dispatch<React.SetStateAction<boolean>>
  setSuccessfullySubscribedAlert: React.Dispatch<React.SetStateAction<boolean>>
}

const SubDetailColumn: React.FC<SubDetailColumnProps> = ({
  subscription,
  customer,
  setSuccessfullySubscribedAlert,
  setViewingPlans
}) => {
  const subscriptionState = useSelector(
    (state: RootState) => state.subscriptionReducer,
  );
  const [UpdatingPlan, setUpdatingPlan] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Subscribe")

  const handleUpdatePlanClick = () => {
    setUpdatingPlan(true);
  };

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

  useEffect(()=> {
    if(subscriptionState.subscription?.id == subscription.id && subscriptionState.stripeSubscription?.status != "canceled") {
      setButtonLabel("Subscribed")
    } else if (subscriptionState.subscription?.id == subscription.id && subscriptionState.stripeSubscription?.status == "canceled") {
      setButtonLabel("Resubscribe")
    }
  },[])

  return (
    <div className='subscription-detail-container'>
      <h2 className={`subscription-detail-name ${colorClass}`}>
        {subscription.name}
      </h2>

      <div className={`subscription-detail-price ${colorClass}`}>
        ${subscription.price}
      </div>
      <div className='subscription-detail-billing'>{billing_cycle}</div>
      <button
        disabled={
          subscriptionState.subscription?.name === subscription.name &&
          subscriptionState.subscription?.billing_cycle === subscription.billing_cycle &&
          subscriptionState.stripeSubscription?.status !== 'canceled'
            ? true
            : false
        }
        className={`subscription-detail-button ${buttonColorClass}`}
        onClick={handleUpdatePlanClick}
      >
      <p>{buttonLabel}</p>
      </button>
      <ul className='subscription-detail-features'>
        {subscription.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      {UpdatingPlan && (
        <ExistingAccountSubscribeForm
          subscription={subscription}
          setUpdatingPlan={setUpdatingPlan}
          setViewingPlans={setViewingPlans}
          setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
        />
      )}
    </div>
  );
};

export default SubDetailColumn;
