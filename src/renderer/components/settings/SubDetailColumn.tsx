import React from 'react';
import { Subscription } from 'src/models/subscription';

interface SubDetailColumnProps {
  subscription: Subscription;
  currentSubscription: Subscription;
}

const SubDetailColumn: React.FC<SubDetailColumnProps> = ({
  subscription,
  currentSubscription,
}) => {

   const handleUpdatePlanClick = () => {
// update sub 
    }

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
  return (
    <div className='subscription-detail-container'>
      <h2 className={`subscription-detail-name ${colorClass}`}>
        {subscription.name}
      </h2>

      <div className={`subscription-detail-price ${colorClass}`}>
        ${subscription.price}
      </div>
      <div className='subscription-detail-billing'>{billing_cycle}</div>
      {/* <div className='subscription-detail-description'>
      {subscription.description}
    </div> */}
      <button
        disabled={
          currentSubscription.name === subscription.name &&
          currentSubscription.billing_cycle === subscription.billing_cycle
            ? true
            : false
        }
        className={`subscription-detail-button ${buttonColorClass}`}
        //   onClick={() => handlePlanSelection()}
      >
        {currentSubscription.name === subscription.name &&
        currentSubscription.billing_cycle === subscription.billing_cycle ? (
          <p>Subscribed</p>
        ) : (
          <p>Update</p>
        )}
      </button>
      <ul className='subscription-detail-features'>
        {subscription.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubDetailColumn;
