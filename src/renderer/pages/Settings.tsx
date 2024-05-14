import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faFileInvoiceDollar,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../services/store';
import { useFetchPaymentMethodMutation } from '../../services/paymentAPI';
import usePagePicker from '../../hooks/usePagePicker';
import SettingsProfile from '$renderer/components/settings/SettingsProfile';
import SettingsSecurity from '$renderer/components/settings/SettingsSecurity';
import SettingsBilling from '$renderer/components/settings/SettingsBilling';
import SettingsDeleteAccount from '$renderer/components/settings/SettingsDeleteAccount';

import '../styles/settings.scss';

const Settings: React.FC = () => {
  const { page, toggleComponent, activeMenuItem } = usePagePicker(
    <SettingsProfile />,
    'profile',
  );
  const subscriptionState = useSelector(
    (state: RootState) => state.subscriptionReducer,
  );
  const paymentMethodState = useSelector(
    (state: RootState) => state.paymentReducer,
  );

  const [fetchPaymentMethod] = useFetchPaymentMethodMutation();

  useEffect(() => {
    
    if (
      subscriptionState.stripeSubscription?.id != null &&
      paymentMethodState.payment == null
    ) {
      console.log(subscriptionState.stripeSubscription)
      const customerInfo = {
        customer: subscriptionState.stripeSubscription.customer,
        id: subscriptionState.stripeSubscription.default_payment_method,
      };
      fetchPaymentMethod(customerInfo);
    }
  }, [
    fetchPaymentMethod,
    paymentMethodState.payment,
    subscriptionState.stripeSubscription,
  ]);

  return (
    <div className='settings-container'>
      <div className='settings-header'>
        <h2>Account Settings</h2>
        <h4>Settings and options for your account.</h4>
      </div>
      <ul className='settings-navbar'>
        <li
          onClick={() => toggleComponent(<SettingsProfile />, 'profile')}
          className={`${activeMenuItem == 'profile' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faUser} className='li-icon' />
          <span>Profile</span>
        </li>
        <li
          onClick={() => toggleComponent(<SettingsSecurity />, 'security')}
          className={`${activeMenuItem == 'security' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faLock} className='li-icon' />
          <span>Security</span>
        </li>
        <li
          onClick={() => toggleComponent(<SettingsBilling />, 'billing')}
          className={`${activeMenuItem == 'billing' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faFileInvoiceDollar} className='li-icon' />
          <span>Billing & Plan</span>
        </li>
        <li
          onClick={() => toggleComponent(<SettingsDeleteAccount />, 'delete')}
          className={`${activeMenuItem == 'delete' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faTrash} className='li-icon' />
          <span>Delete Account</span>
        </li>
      </ul>
      <div className='active-page'>{page}</div>
    </div>
  );
};

export default Settings;
