import React, { useEffect, useState } from 'react';
import { BKExpense } from 'src/models/BKExpense';

interface RecurringExpenseBoxProps {
  recurringExpenses: BKExpense[];
}

const RecurringExpenseBox: React.FC<RecurringExpenseBoxProps> = ({
  recurringExpenses,
}) => {
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    let total = 0;
    for (const expense of recurringExpenses) {
      total += parseInt(expense.amount);
    }
    setTotalExpenses(total);
  }, []);
  return (
    <div className='client-overview-container'>
      <div className='overview-row'>
        <h4>Recurring Expenses: </h4>
        <h4>${totalExpenses}</h4>
      </div>
    </div>
  );
};

export default RecurringExpenseBox;
