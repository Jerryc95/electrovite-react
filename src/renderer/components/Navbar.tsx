import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChevronLeft,
  faGrip,
  faChevronRight,
  faAddressCard,
  // faFile,
  faGear,
  faRightFromBracket,
  faCoins,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';

import flowplanrIcon from '../../../assets/flowplanrIcon.png';
// import { RootState } from '../../services/store';
// import Home from '$renderer/pages/Home';
// import Projects from '$renderer/pages/Projects';
// import Contacts from '../pages/Contacts';
// import Documents from './dashboard/documents/Documents';
// import Bookkeeping from '$renderer/pages/Bookkeeping';
// import AboutPage from '$renderer/pages/AboutPage';
// import Settings from '../pages/Settings';
// import Avatar from './Avatar';
// import exampleAvatar from '../../../assets/Avatars/exampleAvatar.png';
// import usePagePicker from '../../hooks/usePagePicker';
import { useSignOutAccountMutation } from '../../services/authAPI';
import { clearSubscriptionInfo } from '../../services/subscriptionSlice';
import { clearPaymentState } from '../../services/paymentSlice';
import '../styles/navbar.scss';
import {
  getUser,
  resetAccountState,
  selectPage,
} from '../../services/accountSlice';
import { clearBookkeepingState } from '../../services/bookkeepingSlice';
import { clearContactState } from '../../services/contactSlice';
import Emoji from './Emoji';

const Navbar: React.FC = () => {
  // const { toggleComponent } = usePagePicker(<Home />, 'home');
  const [collapsed, setCollapsed] = useState(false);
  const [showingSettings, setShowingSettings] = useState(false);

  const [signOutAccount] = useSignOutAccountMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(getUser);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const setPage = (menuItem: string) => {
    dispatch(selectPage(menuItem));
  };

  const toggleSettings = () => {
    setShowingSettings(!showingSettings);
  };

  const handleSettingsClick = (menuItem: string) => {
    toggleSettings();
    setPage(menuItem);
  };

  const handleSignOut = () => {
    signOutAccount(user);
    dispatch(clearSubscriptionInfo());
    dispatch(clearPaymentState());
    dispatch(clearBookkeepingState());
    dispatch(clearContactState());
    dispatch(resetAccountState());
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
          {collapsed ? <img src={flowplanrIcon} /> : <h2>Flowplanr</h2>}
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
        <Link to='/dashboard'>
          <li
            onClick={() => setPage('home')}
            className={`${
              user.selectedPage == 'home' ? 'active-menu-item' : ''
            }`}
          >
            <FontAwesomeIcon icon={faHome} className='navbar-li-icon' />
            <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
              Dashboard
            </span>
          </li>
        </Link>

        <Link to='/projects'>
          <li
            onClick={() => setPage('projects')}
            className={`${
              user.selectedPage == 'projects' ? 'active-menu-item' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faGrip}
              size='lg'
              className='navbar-li-icon'
            />
            <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
              Projects
            </span>
          </li>
        </Link>

        <Link to='/contacts'>
          <li
            onClick={() => setPage('contacts')}
            className={`${
              user.selectedPage == 'contacts' ? 'active-menu-item' : ''
            }`}
          >
            <FontAwesomeIcon icon={faAddressCard} className='navbar-li-icon' />
            <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
              Contacts
            </span>
          </li>
        </Link>
        {/* <Link to='/documents'>
          <li
            onClick={() => setPage(<Documents />, 'documents')}
            className={`${
              accountState.selectedPage == 'documents' ? 'active-menu-item' : ''
            }`}
          >
            <FontAwesomeIcon icon={faFile} className='navbar-li-icon' />
            <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
              Documents
            </span>
          </li>
        </Link> */}
        <Link to='/bookkeeping'>
          <li
            onClick={() => setPage('bookkeeping')}
            className={`${
              user.selectedPage == 'bookkeeping' ? 'active-menu-item' : ''
            }`}
          >
            <FontAwesomeIcon icon={faCoins} className='navbar-li-icon' />
            <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
              Bookkeeping
            </span>
          </li>
        </Link>
      </ul>
      <ul className='navbar-bottom'>
        <li onClick={toggleSettings}>
          <Emoji
            cName='nav-avatar'
            symbol={
              user.accountProfile?.profile_pic != null
                ? user.accountProfile.profile_pic
                : '❓'
            }
            onClick={() => console.log()}
          />
          <div
            className={`nav-account-info ${collapsed ? 'hidden' : ''}`}
            onClick={toggleSettings}
          >
            <p>
              {capitalize(user.accountProfile?.first_name)}{' '}
              {user.accountProfile?.last_name &&
                (user.accountProfile?.last_name.length > 10
                  ? capitalize(user.accountProfile.last_name[0])
                  : capitalize(user.accountProfile.last_name))}
            </p>
            {user.accountProfile?.title}
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
            <Link to='/about'>
              <li
                onClick={() => handleSettingsClick('about')}
                className={`${showingSettings ? '' : 'hidden'}`}
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className='navbar-li-icon'
                />
                <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
                  About
                </span>
              </li>
            </Link>
            <Link to='/settings'>
              <li
                onClick={() => handleSettingsClick('settings')}
                className={`${showingSettings ? '' : 'hidden'}`}
              >
                <FontAwesomeIcon icon={faGear} className='navbar-li-icon' />
                <span className={`nav-item ${collapsed ? 'hidden' : ''}`}>
                  Settings
                </span>
              </li>
            </Link>
          </div>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
