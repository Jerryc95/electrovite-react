import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Subscription } from 'src/models/subscription';
import { RootState } from '../../../../services/store';

import NewSubscriberForm from './SubcriberForms/NewSubscriberForm';
import ExistingSubscriberForm from './SubcriberForms/ExistingSubscriberForm';
import ReturningSubscriberForm from './SubcriberForms/ReturningSubscriberForm';

interface ExistingAccountSubscribeFormProps {
  subscription: Subscription;
  setUpdatingPlan: React.Dispatch<React.SetStateAction<boolean>>;
  setViewingPlans: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessfullySubscribedAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExistingAccountSubscribeForm: React.FC<
  ExistingAccountSubscribeFormProps
> = ({
  subscription,
  setUpdatingPlan,
  setViewingPlans,
  setSuccessfullySubscribedAlert,
}) => {
  const subscriptionState = useSelector(
    (state: RootState) => state.subscriptionReducer,
  );

  const [component, setComponent] = useState<JSX.Element>(
    <NewSubscriberForm
      subscription={subscription}
      setIsUpdatingPlan={setViewingPlans}
      setViewingPlans={setViewingPlans}
      setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
      customer={subscriptionState.stripeSubscription!.customer}
    />,
  );

  useEffect(() => {
    if (
      subscriptionState.subscription?.id == 1 
      // &&
      // subscriptionState.stripeSubscription?.status != 'canceled'
    ) {
      setComponent(
        <NewSubscriberForm
          subscription={subscription}
          setIsUpdatingPlan={setUpdatingPlan}
          setViewingPlans={setViewingPlans}
          setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
          customer={subscriptionState.stripeSubscription!.customer}
        />,
      );
    } else if (
      // subscriptionState.subscription?.id == 1 
      // &&
      subscriptionState.stripeSubscription?.status == 'canceled'
    ) {
      setComponent(
        <NewSubscriberForm
        subscription={subscription}
        setIsUpdatingPlan={setUpdatingPlan}
        setViewingPlans={setViewingPlans}
        setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
        customer={subscriptionState.stripeSubscription!.customer}
      />,
        // <ReturningSubscriberForm
        //   subscription={subscription}
        //   setIsUpdatingPlan={setUpdatingPlan}
        //   setViewingPlans={setViewingPlans}
        //   setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
        // />,
      );
    } else if (
      subscriptionState.subscription?.id != 1 
      &&
      subscriptionState.stripeSubscription?.status != 'canceled'
    ) {
      setComponent(
        <ExistingSubscriberForm
          subscription={subscription}
          setIsUpdatingPlan={setUpdatingPlan}
          setViewingPlans={setViewingPlans}
          setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
        />,
      );
    }
  }, []);

  return <div>{component}</div>;
};

export default ExistingAccountSubscribeForm;
