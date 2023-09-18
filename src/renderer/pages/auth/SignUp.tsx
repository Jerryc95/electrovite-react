import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

import AuthForm from '$renderer/components/AuthForm';
// import { useRegisterAccountMutation } from '../../../services/authAPI';
import SubscriptionSelectorPage from '../SubscriptionSelectorPage';
import ProfileSetupPage from '../ProfileSetupPage';
import SubPlanPaymentPage from '../SubPlanPaymentPage';
import { Subscription } from 'src/models/subscription';

const defaultSubscription: Subscription = {
  id: 1,
  name: '',
  description: '',
  price: 0,
  billing_cycle: '',
  features: [],
};

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscription, setSubscription] = useState<Subscription | null>(
    defaultSubscription,
  );

  const [creationStep, setCreationStep] = useState(0);

  const handleSignUp = async (formData: {
    email: string;
    password: string;
  }) => {
    setEmail(formData.email);
    setPassword(formData.password);
    // do a fetch to see if the email exists if not than set creation step to 1
    // else give email arleady taken alert
    setCreationStep(1);

    // registerUser(formData).then((data) => {
    //   if (data) {
    //     navigate('/setup/plans');
    //   } else {
    //     console.log('no data');
    //   }
    // });
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
          />
        );
      case 2:
        // this page needs work once i get stripe.js set up
        return (
          <SubPlanPaymentPage
            setCreationStep={setCreationStep}
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
          />
        );
    }
  };

  return <div>{renderComponent()}</div>;
};

export default SignUpPage;
