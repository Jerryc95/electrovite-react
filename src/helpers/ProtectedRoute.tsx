import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import { getSubscription } from '../services/subscriptionSlice';
import Paywall from '$renderer/components/Paywall';
import { selectPage } from '../services/accountSlice';

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
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const closePaywall = () => {
    dispatch(selectPage("home"))
    navigate('/')
  };

  const renderRoute = () => {
    if (subscription) {
      if (subscriptionTier > subscription.tier) {
        return (
          <Paywall
            subscription={subscription}
            requiredTier={subscriptionTier}
            requestedFeature={requestedFeature}
            onClose={closePaywall}
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
