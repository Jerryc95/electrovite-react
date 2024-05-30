import React, { useState, useEffect, ChangeEvent } from 'react';
import CurrencyInput from 'react-currency-input-field';
import {
  CurrencyInputProps,
  CurrencyInputOnChangeValues,
} from 'react-currency-input-field/dist/components/CurrencyInputProps';

import useBackClick from '../../../../hooks/useBackClick';
import DeleteModal from '$renderer/components/DeleteModal';
import { BKEntry } from 'src/models/BKEntry';
import {
  useRemoveEntryMutation,
  useUpdateEntryMutation,
} from '../../../../services/bookkeepingAPI';

interface EditBKDetailProps {
  id: number | undefined;
  entry: BKEntry;
  setEditingEntry: React.Dispatch<React.SetStateAction<boolean>>;
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

type ListItem<T> = {
  id: number;
  // [key: string]: string;
};

const EditBKEntry: React.FC<EditBKDetailProps> = ({
  id,
  entry,
  setEditingEntry,
}) => {
  const goBack = useBackClick();

  const [updateEntry] = useUpdateEntryMutation();
  const [removeEntry] = useRemoveEntryMutation();

  const [name, setName] = useState(entry.entry_name);
  const [isIncome, setIsIncome] = useState(
    entry.transaction_type == 'Income' ? true : false,
  );
  const [amount, setAmount] = useState<number | null>(
    parseFloat(entry.total_amount),
  );
  const [category, setCategory] = useState(entry.category);
  const [currencyValues, setCurrencyValues] =
    useState<CurrencyInputOnChangeValues>();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [contactID, setContactID] = useState<number | null>(entry.contact_id);
  const [contacts, setContacts] = useState<BKClient[]>([]);
  const [projects, setProjects] = useState<BKProject[]>([]);
  const [projectID, setProjectID] = useState<number | null>(entry.project_id);
  const [currentContact, setCurrentContact] = useState<BKClient | null>(null);
  const [currentProject, setCurrentProject] = useState<BKProject | null>(null);

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

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCategory(event.target.value);
  };

  const getClients = () => {
    const url = `http://localhost:3000/contacts/names/${id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: BKClient[]) => {
        setContacts(data);
        const foundContactIndex = data.findIndex(
          (contact) => contact.id == entry.contact_id,
        );
        if (foundContactIndex != -1) {
          setCurrentContact(data[foundContactIndex]);
        }
      });
  };

  const getProjects = () => {
    const url = `http://localhost:3000/projects/names/${id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: BKProject[]) => {
        setProjects(data);
        const foundIndex = data.findIndex(
          (project) => project.id == entry.project_id,
        );
        if (foundIndex != -1) {
          setCurrentProject(data[foundIndex]);
        }
      });
  };


  const handleDropdownChange = <T extends ListItem<T>>(
    setDataID: (id: number) => void,
    setCurrentItem: (item: T | null) => void,
    items: T[],
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setDataID(parseInt(event.target.value));
    const foundIndex = items.findIndex(
      (item) => item.id == parseInt(event.target.value),
    );
    if (foundIndex != -1) {
      setCurrentItem(items[foundIndex]);
    }
  };

  const handleUpdateEntry = () => {
    let transactionType = 'Income';
    let updatedCategory = category;

    if (!isIncome) {
      transactionType = 'Expense';
    }

    incomeCategories.forEach((c) => {
      if (c == updatedCategory && isIncome == false) {
        updatedCategory = 'None';
      }
    });

    expenseCategories.forEach((c) => {
      if (c == updatedCategory && isIncome == true) {
        updatedCategory = 'None';
      }
    });

    if (amount) {
      const updatedEntry: BKEntry = {
        bookkeeping_id: entry.bookkeeping_id,
        account_id: entry.account_id,
        entry_name: name,
        contact_id: contactID,
        project_id: projectID,
        total_amount: amount.toString(),
        paid_amount: entry.paid_amount,
        outstanding_amount: entry.outstanding_amount,
        category: updatedCategory,
        transaction_type: transactionType,
        description: entry.description,
        entry_date: entry.entry_date,
        first_name: entry.first_name,
        last_name: entry.last_name,
        paid: entry.paid,
        next_payment_date: entry.next_payment_date,
      };
      updateEntry(updatedEntry);
      setEditingEntry(false);
    }
  };

  const toggleDeleteEntry = () => {
    setShowDeleteAlert(!showDeleteAlert);
  };

  const handleDeleteEntry = () => {
    goBack();
    removeEntry(entry.bookkeeping_id);
    setShowDeleteAlert(false);
  };

  useEffect(() => {
    getProjects();
    getClients();
  }, []);

  return (
    <div className='new-bookkeeping-container'>
      <div className='new-bookkeeping-form'>
        <div className='new-bookkeeping-heading'>
          <h2>Edit Entry</h2>
          <button onClick={() => setEditingEntry(false)}>Cancel</button>
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
                Amount
                <CurrencyInput
                  className='new-bookkeeping-amount-input'
                  id='amount-input'
                  name='amount-input'
                  placeholder={`$${entry.total_amount.toString()}`}
                  decimalsLimit={2}
                  prefix='$'
                  onValueChange={handleOnValueChange}
                />
              </label>
            </div>
            <div className='new-bookkeeping-detail-column right-column'>
              <label className='new-bookkeeping-label'>
                Category
                {isIncome ? (
                  <select
                    className='new-bookkeeping-amount-input'
                    onChange={handleCategoryChange}
                    value={
                      entry.transaction_type == 'Income' ? category : 'None'
                    }
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
                    onChange={handleCategoryChange}
                    value={
                      entry.transaction_type == 'Expense' ? category : 'None'
                    }
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
                  onChange={(event) =>
                    handleDropdownChange(
                      setContactID,
                      setCurrentContact,
                      contacts,
                      event,
                    )
                  }
                  value={currentContact != null ? currentContact.id : 0}
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
                  onChange={(event) =>
                    handleDropdownChange(
                      setProjectID,
                      setCurrentProject,
                      projects,
                      event,
                    )
                  }
                  value={currentProject != null ? currentProject.id : 0}
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
            <button className='button-brand-blue' onClick={handleUpdateEntry}>
              Update
            </button>
            <button className='button-brand-pink' onClick={toggleDeleteEntry}>
              Delete
            </button>
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
    </div>
  );
};

export default EditBKEntry;
