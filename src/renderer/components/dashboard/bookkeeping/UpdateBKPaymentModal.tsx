import React, { useState } from 'react';
import CurrencyInput, {
  CurrencyInputOnChangeValues,
  CurrencyInputProps,
} from 'react-currency-input-field';

import { BKEntry } from 'src/models/BKEntry';
import { useUpdateEntryMutation } from '../../../../services/bookkeepingAPI';

interface UpdateBKPaymentModal {
  entry: BKEntry;
  setShowingProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateBKPaymentModal: React.FC<UpdateBKPaymentModal> = ({
  setShowingProjectModal,
  entry,
}) => {
  const [isAddingPayment, setIsAddingPayment] = useState(true);
  const [currencyValues, setCurrencyValues] =
    useState<CurrencyInputOnChangeValues>();
  const [amount, setAmount] = useState<number | null>(
    parseFloat(entry.total_amount),
  );

const [updateEntry] = useUpdateEntryMutation()

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

  const handleUpdatePayment = () => {
    if (amount) {
      let newPaid = 0;
      if (isAddingPayment == true) {
        newPaid = parseFloat(entry.paid_amount) + amount;
      } else {
        newPaid = parseFloat(entry.paid_amount) - amount;
      }
      const updatedEntry: BKEntry = {
        bookkeeping_id: entry.bookkeeping_id,
        account_id: entry.account_id,
        entry_name: entry.entry_name,
        contact_id: entry.contact_id,
        project_id: entry.project_id,
        total_amount: entry.total_amount,
        paid_amount: newPaid.toString(),
        outstanding_amount: entry.outstanding_amount,
        category: entry.category,
        transaction_type: entry.transaction_type,
        description: entry.description,
        entry_date: entry.entry_date,
        first_name: entry.first_name,
        last_name: entry.last_name,
        paid: entry.paid,
        next_payment_date: entry.next_payment_date,
      }
      updateEntry(updatedEntry)
      setShowingProjectModal(false)
    }

  };

  return (
    <div className='update-bk-payment-container'>
      <div className='update-bk-payment-content'>
        <div className='update-bk-payment-heading'>
          <h2>
            {isAddingPayment ? 'Adding' : 'Removing'} payment to{' '}
            {entry.entry_name}
          </h2>
          <button
            className='button-brand-magenta'
            onClick={() => {
              setShowingProjectModal(false);
            }}
          >
            Cancel
          </button>
        </div>
        <label
          className={`toggle-slider ${
            isAddingPayment ? 'monthly' : 'Expyearlyense'
          } margin-bottom`}
        >
          <input
            type='checkbox'
            checked={isAddingPayment}
            onChange={() => setIsAddingPayment(!isAddingPayment)}
          />
          <span className='slider'></span>
          <span className={`label-monthly ${isAddingPayment ? 'active' : ''}`}>
            Add
          </span>
          <span className={`label-yearly ${!isAddingPayment ? 'active' : ''}`}>
            Remove
          </span>
        </label>
        <div className='update-bk-payment-info-row'>
          <h3>Amount Paid:</h3>
          <h3>{entry.paid_amount}</h3>
        </div>
        <div className='update-bk-payment-info-row'>
          <h3>Amount Outstanding:</h3>
          <h3>{entry.outstanding_amount}</h3>
        </div>
        <label className='auth-form-label'>
          Amount
          <CurrencyInput
            className='auth-form-input'
            id='amount-input'
            name='amount-input'
            placeholder={`$0.00`}
            decimalsLimit={2}
            prefix='$'
            onValueChange={handleOnValueChange}
          />
        </label>
        <button
          className='button-brand-dark-blue update-button'
          onClick={handleUpdatePayment}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateBKPaymentModal;
