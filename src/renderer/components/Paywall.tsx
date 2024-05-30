import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import '../styles/paywall.scss';
import { selectPage } from '../../services/accountSlice';
import { Subscription } from 'src/models/subscription';

interface PaywallProps {
  subscription: Subscription;
  requiredTier: number;
  requestedFeature: string;
  onClose: () => void;
}

interface ISubscriptionDetails {
  billing_cycle: string;
  description: string;
  features: string[];
  name: string;
  price: string;
  tier: number;
}

const Paywall: React.FC<PaywallProps> = ({
  subscription,
  requiredTier,
  requestedFeature,
  onClose,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const subscriptions: ISubscriptionDetails[] = [
    {
      billing_cycle: 'Monthly',
      description: 'Best for managing all your work and clients.',
      features: [
        'Everything in the free tier',
        'Unlimited Projects',
        'CRM Management',
        'Link projects with clients',
        'Client Events',
        'Client Tasks',
      ],
      name: 'Plus',
      price: '4.99',
      tier: 2,
    },
    {
      billing_cycle: 'Monthly',
      description: 'Best for managing your work, clients, and finances.',
      features: [
        'Everything in the plus tier',
        'Contract Template',
        'Invoice Templates',
        'Link templates with projects',
        'Link templates with clients',
        'Revenue Tracker',
      ],
      name: 'Pro',
      price: '8.99',
      tier: 3,
    },
  ];

  const [requiredSubscription, setRequiredSubscription] =
    useState<ISubscriptionDetails>(subscriptions[1]);

  const handlePaywallNavigation = (option: string) => {
    if (option === 'dashboard') {
      onClose();
    }
    if (option === 'settings') {
      dispatch(selectPage('settings'));
      navigate('/settings');
    }
  };

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

  const handleSetRequiredSubscription = () => {
    const requiredSub = subscriptions.find((sub) => sub.tier == requiredTier);
    if (requiredSub) {
      setRequiredSubscription(requiredSub);
    }
  };

  const fetchSubscriptions = () => {
    // fetch('http://localhost:3000/subscription')
    //   .then((response) => response.json())
    //   .then((data: Subscription[]) => {
    //     const filteredSubscriptions: Subscription[] = data.reduce<
    //       Subscription[]
    //     >((acc, sub) => {
    //       const existingSub = acc.find((s) => s.tier === sub.tier);
    //       if (!existingSub) {
    //         acc.push(sub);
    //       }
    //       return acc;
    //     }, []);
    //     setSubscriptions(filteredSubscriptions);
    //   });
  };

  useEffect(() => {
    fetchSubscriptions();
    handleSetRequiredSubscription();
  }, []);

  return (
    <div className='paywall-container'>
      <div className='paywall-details'>
        <div className='paywall-header'>
          <h1>
            Unlock all of <span className='flowplanr-header'>Flowplanr</span>
          </h1>
          <h2>
            Access to {requestedFeature} requires a subscription to Flowplanr{' '}
            {requiredSubscription.name}
          </h2>
        </div>
        <div className='paywall-section'>
          <div className='subscription-detail-row'>
            <div className='subscription-detail-container'>
              <h3>Your Plan</h3>
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
            <div className='subscription-detail-container'>
              <h3>Plan Required</h3>
              <h2 className={getPlanColorClass(requiredSubscription.name)}>
                {requiredSubscription.name}
              </h2>
              <h4>
                <div>
                  {requiredSubscription.price}/
                  {requiredSubscription.billing_cycle}
                </div>
              </h4>
              <div className='sub-feature-list'>
                {requiredSubscription.features.map((feature) => (
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
          <div className='paywall-button-column'>
            <button
              className='button-brand-darker-purple'
              onClick={() => {
                handlePaywallNavigation('settings');
              }}
            >
              Upgrade Your Plan
            </button>
            <button
              className='button-brand-pink'
              onClick={() => {
                handlePaywallNavigation('dashboard');
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
