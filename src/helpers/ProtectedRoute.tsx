import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { getSubscription } from '../services/subscriptionSlice';
import Paywall from '$renderer/components/Paywall';

interface ProtectedRouteProps {
  subscriptionTier: number;
  requestedFeature: string;
  //   children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  //   children,
  subscriptionTier,
  requestedFeature,
}) => {
  const subscription = useSelector(getSubscription);

  const renderRoute = () => {
    if (subscription) {
      if (subscriptionTier > subscription.tier) {
        console.log(subscription);
        return (
          <Paywall
            subscription={subscription}
            requiredTier={subscriptionTier}
            requestedFeature={requestedFeature}
          />
        );
      } else {
        // return <>{children}</>;
        <Outlet />;
      }
    }
  };

  return renderRoute();
};

export default ProtectedRoute;
