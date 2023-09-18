import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChevronLeft,
  faGrip,
  faChevronRight,
  faAddressCard,
  faFile,
  faGear,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../services/store';
import Home from '$renderer/components/dashboard/Home';
import Projects from '$renderer/pages/Projects';
import Contacts from '../pages/Contacts';
import Documents from './dashboard/Documents';
import Settings from './dashboard/Settings';
import Avatar from './Avatar';
import exampleAvatar from '../../../assets/Avatars/exampleAvatar.png';

import '../styles/navbar.scss';
import { useSignOutAccountMutation } from '../../services/authAPI';

interface NavbarProps {
  setComponent: React.Dispatch<React.SetStateAction<JSX.Element>>;
}

const Navbar: React.FC<NavbarProps> = ({ setComponent }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('home');
  const [showingSettings, setShowingSettings] = useState(false);

  const [signOutAccount] = useSignOutAccountMutation();

  const navigate = useNavigate();

  const accountState = useSelector((state: RootState) => state.accountReducer);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleComponent = (component: JSX.Element, menuItem: string) => {
    setComponent(component);
    setActiveMenuItem(menuItem);
  };

  const toggleSettings = () => {
    setShowingSettings(!showingSettings);
  };

  const handleSettingsClick = (component: JSX.Element, menuItem: string) => {
    toggleSettings();
    toggleComponent(component, menuItem);
  };

  const handleSignOut = () => {
    console.log('clicked');
    signOutAccount(accountState);
    navigate('/');
  };

  const capitalize = (str: string | undefined) => {
    if (str) {
      return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
    }
  };

  return (
    <nav className={`navbar ${collapsed ? 'collapsed-nav' : ''}`}>
      <ul className='navbar-top'>
        <div className='navbar-heading'>
          <h2>{collapsed ? 'FP' : 'FlowPlanr'}</h2>
          <div
            className={`navbar-chevron-container ${
              collapsed ? 'collapsed-chevron-container' : ''
            }`}
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon
              icon={collapsed ? faChevronRight : faChevronLeft}
              size='xl'
              className={`navbar-chevron ${
                collapsed ? 'collapsed-chevron' : ''
              }`}
            />
          </div>
        </div>
        <li
          onClick={() => toggleComponent(<Home />, 'home')}
          className={`${activeMenuItem == 'home' ? 'active-menu-item' : ''}`}
        >
          <FontAwesomeIcon icon={faHome} className='navbar-li-icon' />
          <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>Home</span>
        </li>
        <li
          onClick={() => toggleComponent(<Projects />, 'projects')}
          className={`${
            activeMenuItem == 'projects' ? 'active-menu-item' : ''
          }`}
        >
          <FontAwesomeIcon icon={faGrip} size='lg' className='navbar-li-icon' />
          <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
            Projects
          </span>
        </li>
        <li
          onClick={() => toggleComponent(<Contacts />, 'contacts')}
          className={`${
            activeMenuItem == 'contacts' ? 'active-menu-item' : ''
          }`}
        >
          <FontAwesomeIcon icon={faAddressCard} className='navbar-li-icon' />
          <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
            Contacts
          </span>
        </li>
        <li
          onClick={() => toggleComponent(<Documents />, 'documents')}
          className={`${
            activeMenuItem == 'documents' ? 'active-menu-item' : ''
          }`}
        >
          <FontAwesomeIcon icon={faFile} className='navbar-li-icon' />
          <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
            Documents
          </span>
        </li>
      </ul>
      <ul className='navbar-bottom'>
        <li onClick={toggleSettings}>
          <Avatar
            cName='nav-avatar'
            src={exampleAvatar}
            alt='Selected Avatar'
            onClick={() => {
              console.log(exampleAvatar);
            }}
          />
          <div
            className={`nav-account-info ${collapsed ? 'hidden' : ''}`}
            onClick={toggleSettings}
          >
            <p>
              {capitalize(accountState.accountProfile?.first_name)}{' '}
              {capitalize(accountState.accountProfile?.last_name)}
            </p>
            {accountState?.account?.email}
          </div>
        </li>
        <div className={`${showingSettings ? 'settings-menu' : 'nav-drawer'}`}>
          <div className={`${showingSettings ? '' : 'hidden'}`}>
            <li
              className={`${showingSettings ? 'nav-item' : ''}`}
              onClick={handleSignOut}
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                size='lg'
                className='navbar-li-icon'
              />
              <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
                Sign Out
              </span>
            </li>

            <li
              onClick={() => handleSettingsClick(<Settings />, 'settings')}
              className={`${showingSettings ? '' : 'hidden'}`}
            >
              <FontAwesomeIcon icon={faGear} className='navbar-li-icon' />
              <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
                Settings
              </span>
            </li>
          </div>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
