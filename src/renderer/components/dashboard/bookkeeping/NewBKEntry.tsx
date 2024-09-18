import React, { useState, useEffect, ChangeEvent } from 'react';
import CurrencyInput from 'react-currency-input-field';
import {
  CurrencyInputProps,
  CurrencyInputOnChangeValues,
} from 'react-currency-input-field/dist/components/CurrencyInputProps';

import { useAddEntryMutation } from '../../../../services/bookkeepingAPI';

interface NewBKEntryProps {
  setAddingEntry: React.Dispatch<React.SetStateAction<boolean>>;
  id: number | undefined;
}

interface BKClient {
  id: number;
  first_name: string;
  last_name: string;
}

interface BKProject {
  id: number;
  name: string;
}

const NewBKEntry: React.FC<NewBKEntryProps> = ({ setAddingEntry, id }) => {
  const [addEntry] = useAddEntryMutation();

  const [isIncome, setIsIncome] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | null>(0);
  const [contactID, setContactID] = useState<number>(0);
  const [contacts, setContacts] = useState<BKClient[]>([]);
  const [projects, setProjects] = useState<BKProject[]>([]);
  const [projectID, setProjectID] = useState<number>(0);
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
    const url = `https://flowplanr-production.up.railway.app/contacts/names/${id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: BKClient[]) => {
        setContacts(data);
      });
  };

  const getProjects = () => {
    const url = `https://flowplanr-production.up.railway.app/projects/names/${id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: BKProject[]) => {
        setProjects(data);
      });
  };

  const handleContactSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const contactIDString = e.target.value;
    const parsedID = parseInt(contactIDString);
    if (isNaN(parsedID)) {
      setContactID(0);
    } else {
      setContactID(parsedID);
    }
  };

  const handleProjectSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const contactIDString = e.target.value;
    const parsedID = parseInt(contactIDString);
    if (isNaN(parsedID)) {
      setProjectID(0);
    } else {
      setProjectID(parsedID);
    }
  };

  const handleCreateNewEntry = async () => {
    const today = new Date();
    let firstName = '';
    let lastName = '';
    let transactionType = 'Income';

    if (!isIncome) {
      transactionType = 'Expense';
    }

    const selectedContact = contacts.find(
      (contact) => contact.id === contactID,
    );
    if (selectedContact) {
      firstName = selectedContact.first_name;
      lastName = selectedContact.last_name;
    }

    const newEntry = {
      accountID: id,
      contactID: contactID,
      totalAmount: amount,
      paidAmount: 0,
      entryName: name,
      transactionType: transactionType,
      description: description,
      entryDate: today,
      category: category,
      projectID: projectID,
    };

    addEntry({ newEntry: newEntry, firstName: firstName, lastName: lastName });

    setAddingEntry(false);
  };

  useEffect(() => {
    getClients();
    getProjects();
  }, []);

  return (
    <div className='new-bookkeeping-container'>
      <div className='new-bookkeeping-form'>
        <div className='new-bookkeeping-heading'>
          <h2>Adding New Entry</h2>
          <button onClick={() => setAddingEntry(false)}>Cancel</button>
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
                  onChange={handleContactSelection}
                >
                  <option>None</option>
                  {contacts.map((client, index) => (
                    <option key={index} value={client.id || 0}>
                      {client.first_name} {client.last_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className='new-bookkeeping-label'>
                Project
                <select
                  className='new-bookkeeping-amount-input'
                  onChange={handleProjectSelection}
                >
                  <option>None</option>
                  {projects.map((project, index) => (
                    <option key={index} value={project.id || 0}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className='new-bookkeeping-create-button'>
            <button className='button-brand-blue' onClick={handleCreateNewEntry}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBKEntry;
