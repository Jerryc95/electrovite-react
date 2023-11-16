import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faCircleCheck,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../../../services/store';
import { BKEntry } from 'src/models/BKEntry';
import { BKExpense } from 'src/models/BKExpense';
import EditField from '$renderer/components/EditField';
import ProgressBar from '$renderer/components/ProgressBar';
import { Contact } from 'src/models/contact';
import CurrencyField from '$renderer/components/CurrencyField';
import CalendarField from '$renderer/components/CalendarField';
import DeleteModal from '$renderer/components/DeleteModal';
import UpdateModal from '$renderer/components/UpdateModal';

interface BKEntryDetailProps {
  entry: BKEntry;
  entries: BKEntry[];
  setShowingEntry: React.Dispatch<React.SetStateAction<boolean>>;
  setEntries: React.Dispatch<React.SetStateAction<BKEntry[]>>;
  setRevenueEntries: React.Dispatch<React.SetStateAction<BKEntry[]>>;
  setExpenseEntries: React.Dispatch<React.SetStateAction<BKEntry[]>>;
  setRecurringExpenses: React.Dispatch<React.SetStateAction<BKExpense[]>>;
  BKHighlights: string[];
}

interface IBK {
  entries: BKEntry[];
  recurringExpenses: BKExpense[];
}

interface BKClient {
  id: number;
  first_name: string;
  last_name: string;
}

const BKEntryDetail: React.FC<BKEntryDetailProps> = ({
  entry,
  entries,
  setShowingEntry,
  setEntries,
  setRevenueEntries,
  setExpenseEntries,
  setRecurringExpenses,
  BKHighlights,
}) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalClientRevenue, setTotalClientRevenue] = useState(0);
  const [outstandingAmount, setOutstandingAmount] = useState(
    entry.outstanding_amount,
  );
  const [paidAmount, setPaidAmount] = useState(entry.paid_amount);
  // const [nextPayment, setNextPayment] = useState(entry.next_payment_date);
  const [contact, setContact] = useState<Contact>();
  const [contacts, setContacts] = useState<BKClient[]>([]);
  const [selectedContact, setSelectedContact] = useState<BKClient | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showingContactModal, setShowingContactModal] = useState(false);

  const accountState = useSelector((state: RootState) => state.accountReducer);

  const toggleEntry = () => {
    if (accountState) {
      const url = `http://localhost:3000/bookkeeping?id=${accountState.account?.id}`;
      fetch(url)
        .then((response) => response.json())
        .then(async (data: IBK) => {
          await Promise.all([
            setRecurringExpenses(data.recurringExpenses),
            setEntries(data.entries),
            ...BKHighlights.map(async (highlight) => {
              switch (highlight) {
                case 'Revenue': {
                  setRevenueEntries(
                    data.entries.filter(
                      (entry) => entry.transaction_type === 'Income',
                    ),
                  );
                  break;
                }
                case 'Expenses': {
                  setExpenseEntries(
                    data.entries.filter(
                      (entry) => entry.transaction_type === 'Expense',
                    ),
                  );
                  break;
                }
              }
            }),
          ]);
        });
    }
    setShowingEntry(false);
  };

  const dateParser = (date: Date) => {
    return new Date(date);
  };

  const getContact = async (id: number) => {
    if (entry.contact_id || selectedContact !== null) {
      const url = `http://localhost:3000/contacts/${id}`;
      try {
        const response = await fetch(url);
        const responseData = await response.json();
        console.log(responseData);
        setContact(responseData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getContacts = () => {
    const url = `http://localhost:3000/contacts/names?id=${accountState.account?.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: BKClient[]) => {
        setContacts(data);
      });
  };

  const handleAddContact = async () => {
    const url = `http://localhost:3000/bookkeeping/update/${entry.bookkeeping_id}`;
    if (selectedContact) {
      const data = {
        contactID: selectedContact.id,
      };
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(async (data: BKEntry) => {
          await Promise.all([getContact(data.contact_id || 0)]);
        });

      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const responseData: BKEntry = await response.json();
        if (responseData.contact_id) {
          getContact(responseData.contact_id);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteEntry = () => {
    const url = `http://localhost:3000/bookkeeping/delete/${entry.bookkeeping_id}`;
    try {
      fetch(url, {
        method: 'DELETE',
      });
      setEntries(
        entries.filter((e) => e.bookkeeping_id != entry.bookkeeping_id),
      );
      setShowingEntry(false);
    } catch (error) {
      console.log(error);
    }
    setShowDeleteAlert(false);
  };

  useEffect(() => {
    let revenue = 0;
    let clientRevenue = 0;
    entries.forEach((e) => {
      if (e.contact_id === entry.contact_id) {
        revenue += parseInt(e.total_amount);
        clientRevenue += parseInt(e.total_amount);
      } else {
        revenue += parseInt(e.total_amount);
      }
    });
    setTotalRevenue(revenue);
    setTotalClientRevenue(clientRevenue);
    if (entry.contact_id) {
      getContact(entry.contact_id);
    }
  }, [selectedContact]);

  return (
    <div className='detail-container'>
      <div className='detail-header'>
        <div className='detail-header-leading'>
          <div className='detail-header-back' onClick={toggleEntry}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <p>Bookkeeping</p>
          </div>
          <h2>{entry.entry_name}</h2>
        </div>
        <div className='detail-row'>
          <h3 className='mr-8'>
            {dateParser(entry.entry_date).toLocaleDateString()}
          </h3>
          <FontAwesomeIcon
            className='settings-button'
            icon={faTrash}
            onClick={() => setShowDeleteAlert(!showDeleteAlert)}
          />
        </div>
      </div>
      <div className='detail-main-container'>
        <div className='detail-row jc-sb'>
          <h1 className={entry.transaction_type}>
            $
            {parseFloat(entry.total_amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h1>
          <div className='detail-col align-fe'>
            <h4>{entry.transaction_type}</h4>
            <h3>{entry.category}</h3>
          </div>
        </div>
        <div style={{ width: `60%` }}>
          <EditField
            label='Description:'
            field='description'
            value={entry.description}
            id={entry.bookkeeping_id}
            isInput={false}
            baseURL='http://localhost:3000/bookkeeping/update/'
          />
        </div>

        <div className='detail-row jc-sb'>
          <div className='long-detail-card'>
            <div className='detail-row jc-sb pd4'>
              <h3>Paid:</h3>
              <div className='detail-row'>
                <CurrencyField
                  label=''
                  field='paidAmount'
                  value={paidAmount}
                  id={entry.bookkeeping_id}
                  baseURL='http://localhost:3000/bookkeeping/update/'
                  totalAmount={entry.total_amount}
                  outstandingAmount={outstandingAmount}
                  setPaidAmount={setPaidAmount}
                  setOutstandingAmount={setOutstandingAmount}
                />
              </div>
            </div>
            <div className='detail-row jc-sb pd4'>
              <h3>Outstanding:</h3>
              <h3>
                $
                {parseFloat(outstandingAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <ProgressBar
            height={30}
              total={parseFloat(entry.total_amount)}
              current={parseFloat(paidAmount)}
            />
          </div>
          <div className='third-detail-card'>
            <div className='detail-col ai-cen'>
              {parseFloat(outstandingAmount) === 0 ? (
                <div className='detail-col ai-cen'>
                  <h2>Paid</h2>
                  <FontAwesomeIcon
                    className='check-icon'
                    icon={faCircleCheck}
                    size='2xl'
                  />
                </div>
              ) : (
                <div className='detail-col ai-cen'>
                  <h2>Next Payment</h2>
                  <CalendarField
                    label=''
                    field='nextPaymentDate'
                    value={entry.next_payment_date}
                    id={entry.bookkeeping_id}
                    baseURL='http://localhost:3000/bookkeeping/update/'
                  />
                </div>
              )}
            </div>
          </div>
          <div className='short-detail-card'>
            <div className='detail-col ac-sb'>
              <h2>Revenue %</h2>
              <div>
                <h4>
                  Total:{' '}
                  {(
                    (parseInt(entry.total_amount) / totalRevenue) *
                    100
                  ).toFixed(0)}
                  %
                </h4>
                {contact && (
                  <h4>
                    Client:{' '}
                    {(
                      (parseFloat(entry.total_amount) / totalClientRevenue) *
                      100
                    ).toFixed(0)}
                    %
                  </h4>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='detail-row jc-sb'>
          <div
            className='third-detail-card pd4'
            onClick={() => console.log(entry)}
          >
            {contact ? (
              <div className='detail-col pd4'>
                <h3>
                  {contact.first_name} {contact.last_name}
                </h3>
                <h4>{contact.email}</h4>
                <h4>{contact.phone}</h4>
              </div>
            ) : (
              <div className='detail-col ai-cen'>
                <p className='filler-text'>No Contact Connected</p>
                <button
                  className=' main-button button-brand-pink'
                  onClick={() => setShowingContactModal(true)}
                >
                  Connect Contact
                </button>
              </div>
            )}
          </div>
          <div className='third-detail-card pd4 ai-cen'>
            {contact ? (
              <div className='detail-col'>
                <h3>Invoice/doc links</h3>
              </div>
            ) : (
              <div className='detail-col jc-cen'>
                <p className='filler-text'>No Invoice Connected</p>

                <button className='main-button button-brand-purple'>
                  Connect Invoice
                </button>
              </div>
            )}
          </div>
          <div className='third-detail-card pd4 ai-cen'>
            {contact ? (
              <div className='detail-col'>
                <h3>Project link</h3>
              </div>
            ) : (
              <div className='detail-col'>
                <p className='filler-text'>No Project Connected</p>
                <button className='main-button button-brand-lighter-blue'>
                  Connect Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteAlert && (
        <DeleteModal
          onDelete={handleDeleteEntry}
          setShowingModal={setShowDeleteAlert}
          item='entry'
        />
      )}
      {showingContactModal && (
        <UpdateModal
          onSubmit={handleAddContact}
          onLoad={getContacts}
          setShowingModal={setShowingContactModal}
          item='contact'
          data={contacts}
          setData={setSelectedContact}
        />
      )}
    </div>
  );
};

export default BKEntryDetail;
