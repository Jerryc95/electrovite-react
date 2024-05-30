import React, { useState } from 'react';

import AuthForm from '$renderer/components/AuthForm';
import SubscriptionSelectorPage from '../accountSetup/SubscriptionSelectorPage';
import ProfileSetupPage from '../accountSetup/ProfileSetupPage';
import SubPlanPaymentPage from '../accountSetup/SubPlanPaymentPage';
import { Subscription } from 'src/models/subscription';
import { StripeSubscription } from 'src/models/stripeSubscription';
// import { useSelector } from 'react-redux';
// import { getStripeCustomer } from 'src/services/subscriptionSlice';

const defaultSubscription: Subscription = {
  id: 1,
  name: '',
  description: '',
  price: 0,
  billing_cycle: '',
  features: [],
  stripe_price_id: '',
  tier: 0
};

const SignUpPage: React.FC = () => {
  // const customer = useSelector(getStripeCustomer)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscription, setSubscription] = useState<Subscription | null>(
    defaultSubscription,
  );
  const [creationStep, setCreationStep] = useState(0);
  const [stripeSubscription, setStripeSubscription] =
    useState<StripeSubscription | null>(null);

  const handleSignUp = async (formData: {
    email: string;
    password: string;
  }) => {
    
    setEmail(formData.email);
    setPassword(formData.password);
    setCreationStep(1);
  };

  const renderComponent = () => {
    switch (creationStep) {
      case 0:
        return <AuthForm type='signup' onSubmit={handleSignUp} />;
      case 1:
        return (
          <SubscriptionSelectorPage
            setSubscription={setSubscription}
            setCreationStep={setCreationStep}
            email={email}
            // setCustomer={setCustomer}
          />
        );
      case 2:
        return (
          <SubPlanPaymentPage
            setCreationStep={setCreationStep}
            setStripeSubscription={setStripeSubscription}
            subscription={subscription}
          />
        );
      case 3:
        return (
          <ProfileSetupPage
            email={email}
            password={password}
            setCreationStep={setCreationStep}
            subscription={subscription}
            stripeSubscription={stripeSubscription}
          />
        );
    }
  };

  return <div>{renderComponent()}</div>;
};

export default SignUpPage;
