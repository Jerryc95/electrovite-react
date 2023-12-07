import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faFileInvoiceDollar, faTrash } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../services/store';
import SettingsProfile from '$renderer/components/settings/SettingsProfile';
import SettingsSecurity from '$renderer/components/settings/SettingsSecurity';
import SettingsBilling from '$renderer/components/settings/SettingsBilling';
import SettingsDeleteAccount from '$renderer/components/settings/SettingsDeleteAccount';

import '../styles/settings.scss';

const Settings: React.FC = () => {
  const accountState = useSelector((state: RootState) => state.accountReducer);
  const [page, setPage] = useState(<SettingsProfile />);
  const [activeSettingsItem, setActiveSettingsItem] = useState('profile');

  const toggleComponent = (component: JSX.Element, menuItem: string) => {
    setPage(component);
    setActiveSettingsItem(menuItem);
  };

  return (
    <div className='settings-container'>
      <div className='settings-header'>
        <h2>Account Settings</h2>
        <h4>Settings and options for your account.</h4>
      </div>
      <ul className='settings-navbar'>
        <li
          onClick={() => toggleComponent(<SettingsProfile />, 'profile')}
          className={`${activeSettingsItem == 'profile' ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faUser} className='li-icon' />
          <span>Profile</span>
        </li>
        <li
          onClick={() => toggleComponent(<SettingsSecurity />, 'security')}
          className={`${activeSettingsItem == 'security' ? 'active' : ''}`}
        >
            <FontAwesomeIcon icon={faLock} className='li-icon' />
          <span>Security</span>
        </li>
        <li
          onClick={() => toggleComponent(<SettingsBilling />, 'billing')}
          className={`${activeSettingsItem == 'billing' ? 'active' : ''}`}
        >
            <FontAwesomeIcon icon={faFileInvoiceDollar} className='li-icon' />
          <span>Billing & Plan</span>
        </li>
        <li
          onClick={() => toggleComponent(<SettingsDeleteAccount />, 'delete')}
          className={`${activeSettingsItem == 'delete' ? 'active' : ''}`}
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
