import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import {
  CurrencyInputProps,
  CurrencyInputOnChangeValues,
} from 'react-currency-input-field/dist/components/CurrencyInputProps';

import { BKExpense } from 'src/models/BKExpense';
import '../../../../styles/newItem.scss';
import { useAddRecurringExpenseMutation } from '../../../../../services/bookkeepingAPI';

interface NewExpenseProps {
  setAddingExpense: React.Dispatch<React.SetStateAction<boolean>>;
  accountID: number | undefined;
  // setRecurringExpenses: React.Dispatch<React.SetStateAction<BKExpense[]>>;
}

const NewExpense: React.FC<NewExpenseProps> = ({
  setAddingExpense,
  accountID,
  // setRecurringExpenses,
}) => {
  const [addRecurringExpense] = useAddRecurringExpenseMutation()

  const [reDescription, setReDescription] = useState('');
  const [amount, setAmount] = useState<number | null>(0);
  const [frequency, setFrequency] = useState('Monthly');
  const [currencyValues, setCurrencyValues] =
    useState<CurrencyInputOnChangeValues>();
  const frequencies = [
    'Daily',
    'Weekly',
    'Monthly',
    'Quarterly',
    'Semiannually',
    'Annually',
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

  const createExpense = async () => {
    const newExpense = {
      id: accountID,
      reDescription: reDescription,
      amount: amount,
      frequency: frequency,
    };

    addRecurringExpense(newExpense)
    setAddingExpense(false);
  };

  return (
    <div className='new-item-container'>
      <div className='new-item-form'>
        <div className='new-item-heading'>
          <h2>New Recurring Expense</h2>
          <button
          className='button-brand-magenta'
            onClick={() => {
              setAddingExpense(false);
            }}
          >
            Cancel
          </button>
        </div>
        <div className='new-item-details-container'>
          <div className='new-item-details jc-cen'>
            <div className='new-item-detail-column'>
              <label className='new-item-label'>
                Reoccuring Expense
                <input
                  className='new-item-input'
                  type='text'
                  value={reDescription}
                  onChange={(e) => {
                    setReDescription(e.target.value);
                  }}
                />
              </label>
              <label className='new-item-label'>
                Frequency
                <select
                  className='new-item-input'
                  value={frequency}
                  onChange={(e) => {
                    setFrequency(e.target.value);
                  }}
                >
                  {frequencies.map((frequency, index) => (
                    <option key={index} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
              </label>
              <label className='new-item-label'>
                Amount
                <CurrencyInput
                  className='new-item-amount-input'
                  id='amount-input'
                  name='amount-input'
                  placeholder='$0.00'
                  decimalsLimit={2}
                  prefix='$'
                  onValueChange={handleOnValueChange}
                />
              </label>
              <div className='new-item-create-button'>
                <button onClick={createExpense}>Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewExpense;
