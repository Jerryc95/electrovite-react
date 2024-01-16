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
import { StripeSubscription } from 'src/models/stripeSubscription';
import InvoiceRowLabel from './InvoiceRowLabel';
import SubscriptionUpdate from './subscriptionUpdate';

const SettingsBilling: React.FC = () => {
  const accountState = useSelector((state: RootState) => state.accountReducer);
  const [editingPlan, setEditingPlan] = useState(false);
  const [invoices, setInvoices] = useState<StripeInvoice[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<StripeInvoice[]>([]);
  const [stripeSubcriptionInfo, setStripeSubscriptionInfo] =
    useState<StripeSubscription | null>(null);
  // const [editingBilling, constEditingBilling] = useState(false);
  const [showingAllHistory, setShowingAllHistory] = useState(false);
  const [nextBillingDate, setNextBillingDate] = useState<string | null>(null);
  const [updatingPlan, setUpdatingPlan] = useState(false);

  const toggleEdit = (
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setEditing((value) => !value);
  };

  let planClass = 'Starter';

  switch (accountState.subscriptionInfo?.name) {
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
    if (accountState.subscriptionInfo?.customer_id !== null) {
      const pastInvoiceUrl = `http://localhost:3000/payment/past-invoices/${accountState.subscriptionInfo?.customer_id}`;
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
            // const sortedData: StripeInvoice[] = data.data.sort(
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
  }, []);

  useEffect(() => {
    if (accountState.subscriptionInfo?.customer_id !== null) {
      const subInfoUrl = `http://localhost:3000/payment/retrieve-subscription/${accountState.subscriptionInfo?.stripe_sub_id}`;
      fetch(subInfoUrl)
        .then((response) => response.json())
        .then((data) => {
          const subInfo: StripeSubscription = {
            id: data.id,
            customer: data.customer,
            start_date: data.start_date,
            current_period_end: data.current_period_end,
            current_period_start: data.current_period_start,
            trial_end: data.current_trial_end,
            cancel_at: data.cancel_at,
            cancel_at_period_end: data.cancel_at_period_end,
            canceled_at: data.canceled_at,
            status: data.status,
          };
          console.log(subInfo)
          setStripeSubscriptionInfo(subInfo);
          const billingDate = new Date(subInfo.current_period_end * 1000);
          const formattedBillingDate = billingDate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          setNextBillingDate(formattedBillingDate);
        });
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
            {accountState.subscriptionInfo?.name.toUpperCase()}
            {stripeSubcriptionInfo !== null &&
              stripeSubcriptionInfo?.status === 'trialing' && (
                <span>TRIAL</span>
              )}
            {stripeSubcriptionInfo !== null &&
              stripeSubcriptionInfo?.status === 'canceled' && (
                <span>CANCELED</span>
              )}
          </span>
          <button
            className='button-brand-purple'
            onClick={() => toggleEdit(setUpdatingPlan)}
          >
            Update
          </button>
        </h5>
        <div className='settings-section-row'>
          <div className='settings-section-column'>
            <p className='header'>Cost</p>
            <p>${accountState.subscriptionInfo?.price}</p>
          </div>
          <div className='settings-section-column'>
            <p className='header'>Term</p>
            <p>{accountState.subscriptionInfo?.billing_cycle}</p>
          </div>
          <div className='settings-section-column'>
            {stripeSubcriptionInfo !== null &&
            stripeSubcriptionInfo?.status === 'canceled' &&
            accountState.subscriptionInfo?.id != 1 ? (
              <div>
                <p className='header'>Subscription Ends</p>
                {nextBillingDate !== null ? (
                  <p>{nextBillingDate}</p>
                ) : (
                  <p>N/A</p>
                )}
              </div>
            ) : (
              <div>
                <p className='header'>Next Billing Date</p>
                {nextBillingDate !== null ? (
                  <p>{nextBillingDate}</p>
                ) : (
                  <p>N/A</p>
                )}
              </div>
            )}
          </div>
        </div>
        <h5>What You're Getting:</h5>
        <div className='settings-section-row margin-top feature-highlights'>
          {accountState.subscriptionInfo?.features.map((feature) => (
            <div className='settings-section-column'>
              <p className='plan-highlight'>
                <FontAwesomeIcon icon={faCircleCheck} className='check-icon' />
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className='settings-section bottom-border'>
        <div className='settings-section-header'>
          <h4>Billing Info</h4>
          <div
            className='settings-section-edit'
            onClick={() => toggleEdit(setEditingPlan)}
          >
            {editingPlan ? <span>Cancel</span> : <span>Update</span>}
            <FontAwesomeIcon
              icon={faPenToSquare}
              className='edit-icon'
              size='sm'
            />
          </div>
        </div>
        <div className='settings-section-row'>
          <div className='setttings-section-column'>
            <h5>Billing Address</h5>
            <form className='settings-form'>
              <label className='edit-settings-label'>
                Address
                <input
                  className='edit-settings-long-input'
                  type='text'
                  name='first_name'
                  placeholder='Enter Street'
                  value=''
                  // onChange={}
                />
              </label>
            </form>
          </div>
          <div className='settings-section-column'>
            <h5>Payment Method</h5>
            <form className='settings-form'>
              <label className='edit-settings-label'>
                Card Holder
                <input
                  className='edit-settings-long-input'
                  type='text'
                  name='card_holder'
                  placeholder='John Smith'
                  value=''
                  // onChange={}
                />
              </label>
              <label className='edit-settings-label'>
                Credit Card Number
                <input
                  className='edit-settings-long-input'
                  type='text'
                  name='credit_number'
                  placeholder='0123 XXXX XXXX XXXX'
                  value=''
                  // onChange={}
                />
              </label>
            </form>
          </div>
        </div>
      </div>
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
                    <InvoiceRow invoice={invoice} />
                  ))}
                </div>
              ) : (
                <div>
                  {invoices.map((invoice) => (
                    <InvoiceRow invoice={invoice} />
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
      {updatingPlan && (
        <SubscriptionUpdate
          setUpdatingPlan={setUpdatingPlan}
          setStripeSubscriptionInfo={setStripeSubscriptionInfo}
          stripeSubcriptionInfo={stripeSubcriptionInfo}
        />
      )}
    </div>
  );
};

export default SettingsBilling;
