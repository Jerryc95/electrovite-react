import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import SignInPage from '$renderer/pages/auth/SignIn';
import SignUpPage from '$renderer/pages/auth/SignUp';
import Dashboard from '$renderer/pages/dashboard';
import CreatingAccountPage from '$renderer/pages/CreatingAccountPage';

import { RootState } from 'src/services/store';

import '../styles/main.scss';
import ForgotPasswordPage from '$renderer/pages/auth/ForgotPassword';
import ResetPasswordPage from '$renderer/pages/auth/ResetPassword';

const App = () => {
  const account = useSelector(
    (state: RootState) => state.accountReducer.account,
  );

  return (
    <div>
      <Routes>
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='forgot-password' element={<ForgotPasswordPage />} />
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
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
