import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faBook } from '@fortawesome/free-solid-svg-icons';

import usePagePicker from '../../hooks/usePagePicker';

import FPEULA from '$renderer/components/settings/FPEULA';
import FPPrivacy from '$renderer/components/settings/FPPrivacy';

const AboutPage: React.FC = () => {
  const { page, toggleComponent, activeMenuItem } = usePagePicker(
    <FPPrivacy />,
    'privacy',
  );


  return (
    <div className='settings-container'>
      <div className='settings-header'>
        <h2>About</h2>
      </div>
      <ul className='settings-navbar'>
        <li
          className={`${activeMenuItem == 'privacy' ? 'active' : ''}`}
          onClick={() => toggleComponent(<FPPrivacy />, 'privacy')}
        >
          <FontAwesomeIcon icon={faShieldHalved} className='li-icon' />
          <span>Privacy</span>
        </li>
        <li
          className={`${activeMenuItem == 'eula' ? 'active' : ''}`}
          onClick={() => toggleComponent(<FPEULA />, 'eula')}
        >
          <FontAwesomeIcon icon={faBook} className='li-icon' />
          <span>EULA</span>
        </li>
      </ul>
      <div className='active-page'>{page}</div>
    </div>
  );
};

export default AboutPage;
