import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faChevronUp,
  faChevronDown,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../../services/store';
import { StripeInvoice } from 'src/models/stripeInvoice';
import InvoiceRow from './InvoiceRow';
// import { StripeSubscription } from 'src/models/stripeSubscription';
import InvoiceRowLabel from './InvoiceRowLabel';
import SubscriptionUpdate from './subscriptionSettings/subscriptionUpdate';
import SuccessfullySubscribed from './subscriptionSettings/SuccessfullySubscribed';
import UpdatingPaymentMethod from './subscriptionSettings/UpdatingPaymentMethod';

const SettingsBilling: React.FC = () => {
  const subscriptionState = useSelector(
    (state: RootState) => state.subscriptionReducer,
  );
  const paymentMethodState = useSelector(
    (state: RootState) => state.paymentReducer,
  );

  // const [editingPlan, setEditingPlan] = useState(false);
  const [invoices, setInvoices] = useState<StripeInvoice[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<StripeInvoice[]>([]);
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
  switch (subscriptionState.subscription?.name) {
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
    if (subscriptionState.stripeSubscription?.customer !== null) {
      const pastInvoiceUrl = `http://localhost:3000/payment/past-invoices/${subscriptionState.stripeSubscription?.customer}`;
      fetch(pastInvoiceUrl)
        .then((response) => response.json())
        .then((data) => {
          const invoiceData: StripeInvoice[] = data.data.map((d: any) => ({
            id: d.id,
            account_name: d.account_name,
            amount_due: d.amount_due,
            amount_paid: d.amount_paid,
            customer: d.customer,
            customer_address: d.customer_address,
            customer_email: d.customer_email,
            customer_name: d.customer_name,
            period_end: d.lines?.data[0]?.period.end,
            period_start: d.lines?.data[0]?.period.start,
            hosted_invoice_url: d.hosted_invoice_url,
            invoice_pdf: d.invoice_pdf,
            subscription: d.subscription,
            description: d.lines?.data[0]?.description,
          }));

          const sortedData: StripeInvoice[] = invoiceData.sort(
            (a: StripeInvoice, b: StripeInvoice) => {
              const dateA = a.period_start;
              const dateB = b.period_start;
              if (dateA > dateB) {
                return -1;
              }
              return 0;
            },
          );
          const allInvoices = [...sortedData];
          const filteredInvoices = [...sortedData];

          setInvoices(allInvoices);
          setRecentInvoices(filteredInvoices.slice(0, 1));
        });
    }
  }, [subscriptionState.stripeSubscription?.customer]);

  useEffect(() => {
    if (
      subscriptionState.stripeSubscription?.current_period_end &&
      subscriptionState.subscription?.id != 1
    ) {
      const billingDate = new Date(
        subscriptionState.stripeSubscription.current_period_end * 1000,
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

  return (
    <div className='sub-settings-container'>
      <div className='settings-section bottom-border'>
        <div className='settings-section-header'>
          <h4>Subscription</h4>
        </div>
        <h5>
          Current Plan:
          <span className={planClass}>
            {subscriptionState.subscription?.name.toUpperCase()}
            {subscriptionState.subscription?.id != 1 && (
              <span>
                {subscriptionState.stripeSubscription?.status ===
                  'trialing' && <span>TRIAL</span>}
                {subscriptionState.stripeSubscription?.status ===
                  'canceled' && <span>CANCELED</span>}
              </span>
            )}
          </span>
          <button
            className='button-brand-purple'
            onClick={() => toggleEdit(setViewingPlans)}
          >
            {subscriptionState.subscription?.id == 1 ? (
              <span>Subscribe</span>
            ) : (
              <span>Update</span>
            )}
          </button>
        </h5>
        <div className='settings-section-row'>
          <div className='settings-section-column'>
            <p className='header'>Cost</p>
            <p>${subscriptionState.subscription?.price}</p>
          </div>
          <div className='settings-section-column'>
            <p className='header'>Term</p>
            <p>{subscriptionState.subscription?.billing_cycle}</p>
          </div>
          <div className='settings-section-column'>
            <div>
              {subscriptionState.stripeSubscription?.status == 'canceled' &&
              subscriptionState.subscription?.id != 1 ? (
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
          {subscriptionState.subscription?.features.map((feature) => (
            <div key={feature} className='settings-section-column'>
              <p className='plan-highlight'>
                <FontAwesomeIcon icon={faCircleCheck} className='check-icon' />
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
      {paymentMethodState.payment && (
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
                <p>{paymentMethodState.payment?.address.line1}</p>
                <p>{paymentMethodState.payment?.address.line2}</p>
                <p>
                  {paymentMethodState.payment?.address.city},{' '}
                  {paymentMethodState.payment?.address.state}{' '}
                  {paymentMethodState.payment?.address.postal_code}
                </p>
              </div>
            </div>
            <div className='settings-section-column'>
              <h5>Payment Method</h5>
              <div className='billing-details'>
                <p>
                  <span>Card: </span>
                  {paymentMethodState.payment?.card} ending in{' '}
                  {paymentMethodState.payment?.lastFour}
                </p>
                <p>
                  <span>Expiration Date: </span>
                  {paymentMethodState.payment?.expirationMonth}/
                  {paymentMethodState.payment?.expirationYear}
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
            <p className=''>FlowPlanr subscription invoices will appear here</p>
          )}
          <p>
            FlowPlanr maintains the last 60 invoices. We recommend downloading
            any invoices that you wish to retain for your records.{' '}
          </p>
        </div>
      </div>
      {viewingPlans && (
        <SubscriptionUpdate
          setViewingPlans={setViewingPlans}
          customer={subscriptionState.stripeSubscription!.customer}
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
