import React, { useState } from 'react';

import Home from '$renderer/pages/Home';
import Navbar from '$renderer/components/Navbar';

import "../styles/dashboard.scss"

const Dashboard: React.FC = () => {
  // const [component, setComponent] = useState<JSX.Element>(<Home />);
 
  return (
    <div className='dashboard-container'>
      <Navbar />
      {/* {component} */}
      {/* maybe put hte paywall here */}
    </div>
  );
};

export default Dashboard;
