import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import AuthForm from '$renderer/components/AuthForm';
import { useSignInAccountMutation } from '../../../services/authAPI';
import Onboarding from '../onboarding/Onboarding';
import { getSettings, resetOnboarding } from '../../../services/settingsSlice';
import { setSignIn } from '../../../services/accountSlice';
import { SignInStatus } from '../../../statuses/signInStatus';
import { getUser } from '../../../services/accountSlice';

// import { useFetchProfileMutation } from '../../../services/profileAPI';

const SignInPage: React.FC = () => {
  const user = useSelector(getUser)
  const settings = useSelector(getSettings);
  const [signInUser, { isLoading }] = useSignInAccountMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const TEST_MODE_RESET_ONBOARDING = () => {
    dispatch(resetOnboarding())
    console.log(user)

  }

  const handleSignIn = async (formData: {
    email: string;
    password: string;
  }) => {
    signInUser(formData).then((data) => {
      if ('error' in data) {
        alert('No account found. Email or password are incorrect.');
      } else {
        setSignIn(SignInStatus.Loading)
        navigate('/loading-account');
      }
    });
  };

  useEffect(() => {
    if (user.signedIn === SignInStatus.True) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div>
      <AuthForm type='signin' isLoading={isLoading} onSubmit={handleSignIn} />
      {settings.isOnboarded == false && <Onboarding />}
      <button onClick={TEST_MODE_RESET_ONBOARDING}>TEST MODE ONLY: RESETS ONBOARDING</button>
    </div>
  );
};

export default SignInPage;
