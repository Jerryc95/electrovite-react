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
        />,
      );
    } else if (
      subscriptionState.stripeSubscription?.cancel_at_period_end == true
    ) {
      setComponent(
        // <ReturningSubscriberForm
        //   subscription={subscription}
        //   setIsUpdatingPlan={setUpdatingPlan}
        //   setViewingPlans={setViewingPlans}
        //   setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
        // />,
        <ExistingSubscriberForm
        subscription={subscription}
        setIsUpdatingPlan={setUpdatingPlan}
        setViewingPlans={setViewingPlans}
        setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
        // isCanceling={false}
      />,
      );
    } else if (
      subscriptionState.subscription?.id != 1 &&
      subscriptionState.stripeSubscription?.cancel_at_period_end == false
    ) {
      setComponent(
        <ExistingSubscriberForm
          subscription={subscription}
          setIsUpdatingPlan={setUpdatingPlan}
          setViewingPlans={setViewingPlans}
          setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
          // isCanceling={false}
        />,
      );
    }
  }, []);

  return <div>{component}</div>;
};

export default ExistingAccountSubscribeForm;
