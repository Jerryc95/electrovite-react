import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../services/store';
import '../styles/paywall.scss';

interface PaywallProps {
  content: string;
  plan: string;
}

const Paywall: React.FC<PaywallProps> = ({ content, plan }) => {
  const subscriptionState = useSelector(
    (state: RootState) => state.subscriptionReducer,
  );

  useEffect(() => {
    console.log(subscriptionState);
  }, []);
  return (
    <div className='paywall-container'>
      <div className='paywall-details'>
        <div className='paywall-header'>
          <h1>Unlock all of <span className='flowplanr-header'>Flowplanr</span></h1>
          <h2>
            Access to {content} requires a subscription to Flowplanr {plan}
          </h2>
        </div>
        <div className='paywall-section'>
          <h3>
            {' '}
            By subscribing to Flowplanr {plan}, you'll immediately gain access
            to the following features:{' '}
          </h3>
          
          <ul>
            {/* update to needed plan */}
            {subscriptionState.subscription?.features.map((feature) => (
              <li>{feature}</li>
            ))}
          </ul>
          <h4>
            You can upgrade your plan by navigating to the Billing & Plan
            section in Settings.
          </h4>
        </div>
        <div className='paywall-section'>
          <h3>
            Your {subscriptionState.subscription?.name} plan allows access for
            the following:
          </h3>
          <ul>
            {subscriptionState.subscription?.features.map((feature) => (
              <li>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
