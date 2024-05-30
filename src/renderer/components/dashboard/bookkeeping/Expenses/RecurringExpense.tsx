import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPause } from '@fortawesome/free-solid-svg-icons';

import { BKExpense } from 'src/models/BKExpense';
import DeleteModal from '$renderer/components/DeleteModal';
import {
  useRemoveRecurringExpenseMutation,
  useUpdateRecurringExpenseMutation,
} from '../../../../../services/bookkeepingAPI';

interface RecurringExpenseProps {
  expense: BKExpense;
}

const RecurringExpense: React.FC<RecurringExpenseProps> = ({ expense }) => {
  const [removeExpense] = useRemoveRecurringExpenseMutation();
  const [updateExpense] = useUpdateRecurringExpenseMutation();

  const [showingDeleteModal, setShowingDeleteModal] = useState(false);

  const handleDelete = () => {
    removeExpense(expense.re_id);
    setShowingDeleteModal(false);
  };

  const handlePause = () => {
    const updatedExpense: BKExpense = {
      re_id: expense.re_id,
      account_id: expense.account_id,
      re_description: expense.re_description,
      amount: expense.amount,
      frequency: expense.frequency,
      is_active: !expense.is_active,
      created_at: expense.created_at,
    };
    updateExpense(updatedExpense);
  };

  return (
    <div className={expense.is_active ? `re-container` : 're-container paused'}>
      <div className='re-row'>
        <h4>{expense.re_description}</h4>
        <h4>${expense.amount}</h4>
      </div>
      <div className='re-row'>
        <p className={expense.frequency}>{expense.frequency}</p>
      </div>
      <div className='re-row-right mt-20'>
        <FontAwesomeIcon
          icon={faPause}
          className='pd6 pause-button'
          onClick={handlePause}
        />
        <FontAwesomeIcon
          icon={faTrash}
          className='pd6 delete-button'
          size='sm'
          onClick={() => {
            setShowingDeleteModal(true);
          }}
        />
      </div>
      {showingDeleteModal && (
        <DeleteModal
          onDelete={handleDelete}
          setShowingModal={setShowingDeleteModal}
          item='expense'
        />
      )}
    </div>
  );
};

export default RecurringExpense;
