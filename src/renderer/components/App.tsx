import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import SignInPage from '$renderer/pages/auth/SignIn';
import SignUpPage from '$renderer/pages/auth/SignUp';
import ForgotPasswordPage from '$renderer/pages/auth/ForgotPassword';
import Dashboard from '$renderer/pages/dashboard';
import CreatingAccountPage from '$renderer/pages/CreatingAccountPage';

import { RootState } from 'src/services/store';

import '../styles/main.scss';
import Projects from '$renderer/pages/Projects';
import Contacts from '$renderer/pages/Contacts';
import Bookkeeping from '$renderer/pages/Bookkeeping';
import Settings from '$renderer/pages/Settings';
import Documents from './dashboard/documents/Documents';

const App = () => {
  const account = useSelector(
    (state: RootState) => state.accountReducer.account,
  );

  return (
    <div>
      <Routes>
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/register' element={<SignUpPage />} />
        <Route path='/' element={<SignInPage />} />
        <Route
          path='/creating-account'
          element={<CreatingAccountPage creating={true} />}
        />
        <Route
          path='/loading-account'
          element={<CreatingAccountPage creating={false} />}
        />
        {account != null && (
          <>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/projects' element={<Projects/> } />
            <Route path='/contacts' element={<Contacts/> } />
            <Route path='/bookkeeping' element={<Bookkeeping/> } />
            <Route path='/settings' element={<Settings/> } />
            <Route path='/documents' element={<Documents/> } />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
