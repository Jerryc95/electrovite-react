import React, { useState, useEffect, ChangeEvent } from 'react';
import CurrencyInput from 'react-currency-input-field';
import {
  CurrencyInputProps,
  CurrencyInputOnChangeValues,
} from 'react-currency-input-field/dist/components/CurrencyInputProps';

import { BKEntry } from 'src/models/BKEntry';

interface NewBKEntryProps {
  setAddingEntry: React.Dispatch<React.SetStateAction<boolean>>;
  addingEntry: boolean;
  id: number | undefined;
  setEntries: React.Dispatch<React.SetStateAction<BKEntry[]>>;
  setRevenueEntries: React.Dispatch<React.SetStateAction<BKEntry[]>>;
  setExpenseEntries: React.Dispatch<React.SetStateAction<BKEntry[]>>;
}

interface BKClient {
  id: number;
  first_name: string;
  last_name: string;
}

const NewBKEntry: React.FC<NewBKEntryProps> = ({
  setAddingEntry,
  addingEntry,
  id,
  setEntries,
  setRevenueEntries,
  setExpenseEntries,
}) => {
  const [isIncome, setIsIncome] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | null>(0);
  const [clientID, setClientID] = useState<number>(0);
  const [clients, setClients] = useState<BKClient[]>([]);
  const [category, setCategory] = useState('None');
  const [currencyValues, setCurrencyValues] =
    useState<CurrencyInputOnChangeValues>();

  const incomeCategories = [
    'Service',
    'Product',
    'Commission',
    'Consultant Fee',
    'Investment',
    'Interest',
  ];

  const expenseCategories = [
    'Rent',
    'Utlities',
    'Payroll',
    'Supplies',
    'Travel',
    'Insurance',
    'Professional & Service',
    'Software & Tech',
    'Marketing & Advertising',
    'Equipment & Maintenance',
  ];

  const handleOnValueChange: CurrencyInputProps['onValueChange'] = (
    amount,
    _,
    values,
  ): void => {
    setCurrencyValues(values);
    if (Number.isNaN(Number(amount))) {
      return;
    }
    if (currencyValues) {
      setAmount(currencyValues.float);
    }
  };

  const getClients = () => {
    const url = `http://localhost:3000/contacts/names?id=${id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: BKClient[]) => {
        setClients(data);
      });
  };

  const handleClientSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const clientIDString = e.target.value;
    const parsedID = parseInt(clientIDString);
    if (isNaN(parsedID)) {
      setClientID(0);
    } else {
      setClientID(parsedID);
    }
  };

  const handleCreateNewEntry = async () => {
    const url = 'http://localhost:3000/bookkeeping/add';
    const today = new Date();
    let firstName = '';
    let lastName = '';
    let transactionType = 'Income';

    if (!isIncome) {
      transactionType = 'Expense';
    }

    const selectedClient = clients.find((client) => client.id === clientID);
    if (selectedClient) {
      firstName = selectedClient.first_name;
      lastName = selectedClient.last_name;
    }

    const newEntry = {
      accountID: id,
      contactID: clientID,
      totalAmount: amount,
      paidAmount: 0,
      entryName: name,
      transactionType: transactionType,
      description: description,
      entryDate: today,
      category: category,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });
      const responseData = await response.json();

      const newBKEntry: BKEntry = {
        entry_name: responseData.entry_name,
        bookkeeping_id: responseData.bookkeeping_id,
        contact_id: responseData.contact_id,
        account_id: responseData.account_id,
        total_amount: responseData.total_amount,
        paid_amount: responseData.paid_amount,
        outstanding_amount: responseData.outstanding_amount,
        category: responseData.category,
        transaction_type: responseData.transaction_type,
        description: responseData.description,
        entry_date: responseData.entry_date,
        paid: responseData.paid,
        next_payment_date: responseData.next_payment_date,
        first_name: firstName,
        last_name: lastName,
      };
      setEntries((entries) => [...entries, newBKEntry]);

      isIncome
        ? setRevenueEntries((entries) => [...entries, newBKEntry])
        : setExpenseEntries((entries) => [...entries, newBKEntry]);

      setAddingEntry(!addingEntry);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <div className='new-bookkeeping-container'>
      <div className='new-bookkeeping-form'>
        <div className='new-bookkeeping-heading'>
          <h2>Adding New Entry</h2>
          <button onClick={() => setAddingEntry(!addingEntry)}>Cancel</button>
        </div>
        <div className='new-bookkeeping-details-container'>
          <label
            className={`toggle-slider ${
              isIncome ? 'monthly' : 'Expyearlyense'
            }`}
          >
            <input
              type='checkbox'
              checked={isIncome}
              onChange={() => setIsIncome(!isIncome)}
            />
            <span className='slider'></span>
            <span className={`label-monthly ${isIncome ? 'active' : ''}`}>
              Income
            </span>
            <span className={`label-yearly ${!isIncome ? 'active' : ''}`}>
              Expense
            </span>
          </label>
          <div className='new-bookkeeping-details'>
            <div className='new-bookkeeping-detail-column left-column'>
              <label className='new-bookkeeping-label'>
                Entry Name
                <input
                  className='new-bookkeeping-name-input'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className='new-bookkeeping-label'>
                Description
                <textarea
                  className='new-bookkeeping-description-input'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Optional'
                />
                <span> {`${description.length} / 150 Characters`}</span>
              </label>
            </div>
            <div className='new-bookkeeping-detail-column right-column'>
              <label className='new-bookkeeping-label'>
                Amount
                <CurrencyInput
                  className='new-bookkeeping-amount-input'
                  id='amount-input'
                  name='amount-input'
                  placeholder='$0.00'
                  decimalsLimit={2}
                  prefix='$'
                  onValueChange={handleOnValueChange}
                />
              </label>
              <label className='new-bookkeeping-label'>
                Category
                {isIncome ? (
                  <select
                    className='new-bookkeeping-amount-input'
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>None</option>
                    {incomeCategories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    className='new-bookkeeping-amount-input'
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>None</option>
                    {expenseCategories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                )}
              </label>
              <label className='new-bookkeeping-label'>
                Client
                <select
                  className='new-bookkeeping-amount-input'
                  onChange={handleClientSelection}
                >
                  <option>None</option>
                  {clients.map((client, index) => (
                    <option key={index} value={client.id || 0}>
                      {client.first_name} {client.last_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className='new-bookkeeping-create-button'>
            <button onClick={handleCreateNewEntry}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBKEntry;
