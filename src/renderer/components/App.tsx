import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';


import SignInPage from '$renderer/pages/auth/SignIn';
import SignUpPage from '$renderer/pages/auth/SignUp';
import Dashboard from '$renderer/pages/dashboard';
import CreatingAccountPage from '$renderer/pages/CreatingAccountPage';

import { RootState } from 'src/services/store';

import '../styles/main.scss';



const App = () => {
  const account = useSelector(
    (state: RootState) => state.accountReducer.account,
  );

  return (
    <div>
      <Routes>
        <Route path='/register' element={<SignUpPage />} />
        <Route path='/' element={<SignInPage />} />
        <Route path='/creating-account' element={<CreatingAccountPage />} />
        {account != null && (
          <>
            <Route path='/dashboard' element={<Dashboard />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
