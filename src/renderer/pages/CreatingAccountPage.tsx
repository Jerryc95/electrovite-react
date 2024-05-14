import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from 'src/services/store';
import { useFetchProfileMutation } from '../../services/profileAPI';
import '../styles/spinner.scss';
import '../styles/components/recoverAccount.scss';
import { useFetchSubscriptionInfoMutation } from '../../services/subscriptionAPI';
import { parseDate } from '../../helpers/ParseDate';
import {
  useForceDeleteAccountMutation,
  useRecoverAccountMutation,
} from '../../services/authAPI';

interface CreatingAccountProps {
  creating: boolean;
}

const CreatingAccountPage: React.FC<CreatingAccountProps> = ({ creating }) => {
  const accountState = useSelector((state: RootState) => state.accountReducer);
  const [fetchProfile] = useFetchProfileMutation();
  const [fetchSubscriptionInfo] = useFetchSubscriptionInfoMutation();
  const [forceDeleteAccount] = useForceDeleteAccountMutation();
  const [recoverAccount] = useRecoverAccountMutation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showingAccountRecovery, setShowingAccountRecovery] = useState(false);
  const [viewingMoreOptions, setViewingMoreOptions] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [recoveringAccount, setRecoveringAccount] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  const handleAccountOptions = (option: string) => {
    switch (option) {
      case 'cancel':
        navigate('/sign-in');
        break;
      case 'recover':
        setRecoveringAccount(true);
        break;
      case 'delete':
        setDeletingAccount(true);
        break;
    }
  };

  const handleRecoverAccount = () => {
    const accountObject = {
      email: email,
      password: password,
    };
    recoverAccount(accountObject).then((data) => {
      if ('error' in data) {
        alert('No account found. Email or password are incorrect.');
        return;
      }
    });
  };

  const handleDeleteAccount = () => {
    const accountObject = {
      email: email,
      password: password,
    };
    forceDeleteAccount(accountObject).then((data) => {
      if ('error' in data) {
        console.log(data);
        alert('Error deleting account.');
      } else {
        navigate('/');
      }
    });
  };

  useEffect(() => {
    if (accountState.account) {
      fetchProfile(accountState.account.id).then(() => {
        if (accountState.account) {
          fetchSubscriptionInfo(accountState.account.id).then(() => {
            navigate('/');
          });
        }
      });
    } else if (accountState.error == 'Account Deleted') {
      const today = new Date();
      if (accountState.deletedAt) {
        const deletedDate = parseDate(accountState.deletedAt);
        deletedDate.setDate(deletedDate.getDate() + 30);
        const timeDifference = deletedDate.getTime() - today.getTime();
        setDaysRemaining(
          Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1,
        );
      }

      setShowingAccountRecovery(true);
    }
  }, [
    accountState.account,
    accountState.deletedAt,
    accountState.error,
    fetchProfile,
    fetchSubscriptionInfo,
    navigate,
  ]);

  return (
    <>
      {showingAccountRecovery ? (
        <div className='recover-account-container'>
          <h2>Your account has been deleted</h2>
          <h3>You have {daysRemaining} days to recover you account or data</h3>
          <p className='option-text'>Choose an option below.</p>
          <div>
            <button
              className='button-brand-magenta'
              onClick={() => handleAccountOptions('cancel')}
            >
              Cancel
            </button>
            <button
              className='button-brand-blue'
              onClick={() => handleAccountOptions('recover')}
            >
              Recover Account
            </button>
          </div>
          <p
            className='more-options-toggle'
            onClick={() => setViewingMoreOptions(!viewingMoreOptions)}
          >
            {viewingMoreOptions ? 'Less Options' : 'More Options'}
          </p>
          {viewingMoreOptions && (
            <div>
              <button
                className='button-brand-pink'
                onClick={() => handleAccountOptions('delete')}
              >
                Delete Now
              </button>
            </div>
          )}
          {recoveringAccount && (
            <div className='confirm-delete-account-container'>
              <div className='delete-account-content'>
                <h2>Confirm Account Recovery</h2>
                <p>
                  Sign in below to recover your account. If you were subscribed
                  to a Plus or Pro plan, you will need to resubscribe.
                </p>
                <label className='recover-account-label'>
                  Email
                  <input
                    className='recover-account-input'
                    type='text'
                    name='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label className='recover-account-label'>
                  Password
                  <input
                    className='recover-account-input'
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <div className='button-row'>
                  <button
                    className='button-brand-magenta'
                    onClick={() => setRecoveringAccount(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className='button-brand-blue'
                    onClick={handleRecoverAccount}
                  >
                    Confirm Recovery
                  </button>
                </div>
              </div>
            </div>
          )}
          {deletingAccount && (
            <div className='confirm-delete-account-container'>
              <div className='delete-account-content'>
                <h2>Confirm Delete Account</h2>
                <p>
                  This action is final and there will be no way to recover your
                  data once you confirm.
                </p>
                <label className='recover-account-label'>
                  Email
                  <input
                    className='recover-account-input'
                    type='text'
                    name='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label className='recover-account-label'>
                  Password
                  <input
                    className='recover-account-input'
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <div className='button-row'>
                  <button
                    className='button-brand-magenta'
                    onClick={() => setDeletingAccount(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className='button-brand-pink'
                    onClick={handleDeleteAccount}
                  >
                    Confirm Deletion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='spinner-container'>
          {creating ? (
            <h1>Creating Account...</h1>
          ) : (
            <h1>Loading Account...</h1>
          )}

          <div className='spinner'></div>
        </div>
      )}
    </>
  );
};

export default CreatingAccountPage;
