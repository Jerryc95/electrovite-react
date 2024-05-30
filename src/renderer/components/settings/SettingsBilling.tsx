import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronUp,
  faChevronDown,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../../services/store';
// import { StripeInvoice } from 'src/models/stripeInvoice';
import InvoiceRow from './InvoiceRow';
// import { StripeSubscription } from 'src/models/stripeSubscription';
import InvoiceRowLabel from './InvoiceRowLabel';
import SubscriptionUpdate from './subscriptionSettings/subscriptionUpdate';
import SuccessfullySubscribed from './subscriptionSettings/SuccessfullySubscribed';
import UpdatingPaymentMethod from './subscriptionSettings/UpdatingPaymentMethod';
import { getPayment } from '../../../services/paymentSlice';
import { useFetchPastInvoicesQuery } from '../../../services/paymentAPI';
import {
  getStripeCustomer,
  getStripeSubscription,
} from '../../../services/subscriptionSlice';

const SettingsBilling: React.FC = () => {
  const subscription = useSelector(
    (state: RootState) => state.subscriptionReducer,
  );
  const customer = useSelector(getStripeCustomer);
  const paymentMethod = useSelector(getPayment);
  const stripeSubscription = useSelector(getStripeSubscription);

  const { data } = useFetchPastInvoicesQuery(customer, {
    refetchOnMountOrArgChange: true,
  });
  // const invoices = useMemo(() => {
  //   data || [];
  // }, [data]);
  const invoices = data || [];
  const recentInvoices = data?.slice(0, 3) || [];

  const [showingAllHistory, setShowingAllHistory] = useState(false);
  const [nextBillingDate, setNextBillingDate] = useState<string | null>(null);
  const [viewingPlans, setViewingPlans] = useState(false);
  const [sucessfullySubscribedAlert, setSuccessfullySubscribedAlert] =
    useState(false);
  const [showingUpdatingPayment, setShowingUpdatingPayment] = useState(false);

  const toggleEdit = (
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setEditing((value) => !value);
  };

  let planClass = 'Starter';
  switch (subscription.subscription?.name) {
    case 'Starter':
      planClass = 'starter';
      break;
    case 'Plus':
      planClass = 'plus';
      break;
    case 'Pro':
      planClass = 'pro';
      break;
    default:
      planClass = '';
  }

  useEffect(() => {
    if (
      subscription.stripeSubscription?.current_period_end 
    ) {
      const billingDate = new Date(
        subscription.stripeSubscription.current_period_end * 1000,
      );
      const formattedBillingDate = billingDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      setNextBillingDate(formattedBillingDate);
    } else {
      setNextBillingDate('N/A');
    }
  }, []);

  useEffect(() => {
    console.log(subscription);
  }, []);

  return (
    <div className='sub-settings-container'>
      <div className='settings-section bottom-border'>
        <div className='settings-section-header'>
          <h4>Subscription</h4>
        </div>
        <h5>
          Current Plan:
          <span className={planClass}>
            {subscription.subscription?.name.toUpperCase()}
            {subscription.subscription?.id != 1 && (
              <span>
                {stripeSubscription?.status === 'trialing' && (
                  <span>TRIAL</span>
                )}
                {subscription.stripeSubscription?.status === 'canceled' && (
                  <span>CANCELED</span>
                )}
              </span>
            )}
          </span>
          <button
            className='button-brand-purple'
            onClick={() => toggleEdit(setViewingPlans)}
          >
            {subscription.subscription?.id == 1 ? (
              <span>Subscribe</span>
            ) : (
              <span>Update</span>
            )}
          </button>
        </h5>
        <div className='settings-section-row'>
          <div className='settings-section-column'>
            <p className='header'>Cost</p>
            <p>${subscription.subscription?.price}</p>
          </div>
          <div className='settings-section-column'>
            <p className='header'>Term</p>
            <p>{subscription.subscription?.billing_cycle}</p>
          </div>
          <div className='settings-section-column'>
            <div>
              {subscription.stripeSubscription?.status == 'canceled'  ? (
                <p className='header'>Subscription Ends</p>
              ) : (
                <p className='header'>Next Billing Date</p>
              )}

              <p>{nextBillingDate}</p>
            </div>
          </div>
        </div>
        <h5>What You're Getting:</h5>
        <div className='settings-section-features-column margin-top feature-highlights'>
          {subscription.subscription?.features.map((feature) => (
            <div key={feature} className='settings-section-column'>
              <p className='plan-highlight'>
                <FontAwesomeIcon icon={faCircleCheck} className='check-icon' />
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
      {paymentMethod.payment && (
        <div className='settings-section bottom-border'>
          <div className='settings-section-header'>
            <h4>Billing Info</h4>
            {/* <div
              className='settings-section-edit'
              onClick={() => toggleEdit(setShowingUpdatingPayment)}
            >
              <span>Update</span>
              <FontAwesomeIcon
                icon={faPenToSquare}
                className='edit-icon'
                size='sm'
              />
            </div> */}
          </div>
          <div className='settings-section-row billing'>
            <div className='setttings-section-column '>
              <h5>Billing Address</h5>
              <div className='billing-details'>
                <p>{paymentMethod.payment?.address.line1}</p>
                <p>{paymentMethod.payment?.address.line2}</p>
                <p>
                  {paymentMethod.payment?.address.city},{' '}
                  {paymentMethod.payment?.address.state}{' '}
                  {paymentMethod.payment?.address.postal_code}
                </p>
              </div>
            </div>
            <div className='settings-section-column'>
              <h5>Payment Method</h5>
              <div className='billing-details'>
                <p>
                  <span>Card: </span>
                  {paymentMethod.payment?.card} ending in{' '}
                  {paymentMethod.payment?.lastFour}
                </p>
                <p>
                  <span>Expiration Date: </span>
                  {paymentMethod.payment?.expirationMonth}/
                  {paymentMethod.payment?.expirationYear}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='settings-section'>
        <div className='settings-section-header'>
          <h4>Payment History</h4>
          <div
            className='settings-section-edit'
            onClick={() => toggleEdit(setShowingAllHistory)}
          >
            {showingAllHistory ? <span>Close</span> : <span>Show All</span>}
            {showingAllHistory ? (
              <FontAwesomeIcon
                icon={faChevronUp}
                className='edit-icon'
                size='sm'
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronDown}
                className='edit-icon'
                size='sm'
              />
            )}
          </div>
        </div>
        <div className='invoices-container'>
          {invoices.length !== 0 ? (
            <div>
              <InvoiceRowLabel />
              {!showingAllHistory ? (
                <div>
                  {recentInvoices.map((invoice) => (
                    <InvoiceRow key={invoice.id} invoice={invoice} />
                  ))}
                </div>
              ) : (
                <div>
                  {invoices.map((invoice) => (
                    <InvoiceRow key={invoice.id} invoice={invoice} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className=''>Flowplanr subscription invoices will appear here</p>
          )}
          <p>
            Flowplanr maintains the last 60 invoices. We recommend downloading
            any invoices that you wish to retain for your records.{' '}
          </p>
        </div>
      </div>
      {viewingPlans && (
        <SubscriptionUpdate
          setViewingPlans={setViewingPlans}
          setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
        />
      )}
      {sucessfullySubscribedAlert && (
        <SuccessfullySubscribed
          setSuccessfullySubscribedAlert={setSuccessfullySubscribedAlert}
        />
      )}
      {showingUpdatingPayment && (
        <UpdatingPaymentMethod
          setShowingUpdatingPayment={setShowingUpdatingPayment}
        />
      )}
    </div>
  );
};

export default SettingsBilling;
