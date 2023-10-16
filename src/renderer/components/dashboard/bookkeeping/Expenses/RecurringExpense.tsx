import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPause } from '@fortawesome/free-solid-svg-icons';

import { BKExpense } from 'src/models/BKExpense';
import DeleteModal from '$renderer/components/DeleteModal';

interface RecurringExpenseProps {
  expense: BKExpense;
  expenses: BKExpense[];
  setExpenses: React.Dispatch<React.SetStateAction<BKExpense[]>>;
}

const RecurringExpense: React.FC<RecurringExpenseProps> = ({
  expense,
  expenses,
  setExpenses,
}) => {
  const [showingDeleteModal, setShowingDeleteModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleDelete = () => {
    const url = `http://localhost:3000/bookkeeping/delete/expense/${expense.re_id}`;
    try {
      fetch(url, {
        method: 'DELETE',
      });

      setExpenses(expenses.filter((e) => e.re_id != expense.re_id));
    } catch (error) {
      console.log(error);
    }
    setShowingDeleteModal(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className={isPaused ? `re-container paused` : 're-container'}>
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
