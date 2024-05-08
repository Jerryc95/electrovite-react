import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { BKEntry } from 'src/models/BKEntry';
import { selectedAccount } from '../../services/accountSlice';
import '../styles/bookkeeping.scss';
import BKHighlight from '$renderer/components/dashboard/bookkeeping/BKHighlight';
import NewBKEntry from '$renderer/components/dashboard/bookkeeping/NewBKEntry';
import BKEntryRow from '$renderer/components/dashboard/bookkeeping/BKEntryRow';
import BKEntryRowLabel from '$renderer/components/dashboard/bookkeeping/BKEntryRowLabel';
import NewExpense from '$renderer/components/dashboard/bookkeeping/Expenses/NewExpense';
// import { BKExpense } from 'src/models/BKExpense';
import RecurringExpense from '$renderer/components/dashboard/bookkeeping/Expenses/RecurringExpense';
import {
  selectedEntries,
  selectedExpenseEntries,
  selectedRecurringExpenses,
  selectedRevenueEntries,
  setSelectedEntry,
} from '../../services/bookkeepingSlice';
import { useFetchEntriesQuery } from '../../services/bookkeepingAPI';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// interface IBK {
//   entries: BKEntry[];
//   recurringExpenses: BKExpense[];
// }

const Bookkeeping: React.FC = () => {
  const user = useSelector(selectedAccount);
  const entries = useSelector(selectedEntries);
  const revenueEntries = useSelector(selectedRevenueEntries);
  const expenseEntries = useSelector(selectedExpenseEntries);
  const recurringExpenses = useSelector(selectedRecurringExpenses);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchEntries = useFetchEntriesQuery(user.account?.id, {refetchOnMountOrArgChange: true});

  const [addingEntry, setAddingEntry] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Date');
  const [selectedDate, setSelectedDate] = useState('All Time');

  const filterOptions = ['All', 'Income', 'Expenses'];
  const sortOptions = ['Date', 'Contact', 'Type', 'Category', 'Total'];
  const dateOptions = [
    'All Time',
    'MTD',
    'Last Month',
    'QTD',
    'Last Quarter',
    'YTD',
    'Last Year',
  ];
  const BKHighlights = ['Profit', 'Expenses', 'Revenue', 'Outstanding'];

  const dateParser = (date: Date) => {
    return new Date(date);
  };

  const toggleEntry = (entry: BKEntry) => {
    dispatch(setSelectedEntry(entry));
    navigate(`/bookkeeping/${entry.entry_name.replaceAll(' ', '-')}`);
  };

  const dateFilter = (entries: BKEntry[]) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentQuarter = Math.floor((currentMonth + 2) / 3);
    const currentYear = currentDate.getFullYear();

    return entries.filter((entry) => {
      const entryDate = new Date(entry.entry_date);
      const entryMonth = entryDate.getMonth() + 1;
      const entryQuarter = Math.floor((entryMonth + 2) / 3);
      const entryYear = entryDate.getFullYear();
      switch (selectedDate) {
        case 'All Time': {
          return entry;
        }
        case 'MTD': {
          return entryYear === currentYear && entryMonth === currentMonth;
        }
        case 'Last Month': {
          if (currentMonth == 1) {
            return entryYear === currentYear - 1 && entryMonth === 12;
          } else {
            return entryYear === currentYear && entryMonth === currentMonth - 1;
          }
        }
        case 'QTD': {
          return entryYear === currentYear && entryQuarter === currentQuarter;
        }
        case 'Last Quarter': {
          if (currentQuarter === 1) {
            return entryYear === currentYear - 1 && entryQuarter === 4;
          } else {
            return (
              entryYear === currentYear && entryQuarter === currentQuarter - 1
            );
          }
        }
        case 'YTD': {
          return entryYear === currentYear;
        }
        case 'Last Year': {
          return entryYear === currentYear - 1;
        }
      }
    });
  };

  const sortedEntries = [...dateFilter(entries)].sort((a, b) => {
    switch (selectedSort) {
      case 'Date': {
        return (
          dateParser(b.entry_date).getTime() -
          dateParser(a.entry_date).getTime()
        );
      }
      case 'Contact': {
        if (a.first_name && b.first_name) {
          return a.first_name.localeCompare(b.first_name);
        }
        break;
      }
      case 'Type': {
        return a.transaction_type.localeCompare(b.transaction_type);
      }
      case 'Category': {
        return a.category.localeCompare(b.category);
      }
      case 'Total': {
        return parseFloat(b.total_amount) - parseFloat(a.total_amount);
      }
    }
    return 0;
  });

  const filteredEntries = sortedEntries.filter((entry) => {
    switch (selectedFilter) {
      case 'All': {
        return entry;
      }
      case 'Income':
        {
          if (entry.transaction_type === 'Income') {
            return entry;
          }
        }
        break;
      case 'Expenses': {
        if (entry.transaction_type === 'Expense') {
          return entry;
        }
        break;
      }
    }
  });

  // useEffect(() => {
  // if (accountState) {
  //   const url = `http://localhost:3000/bookkeeping?id=${accountState.account?.id}`;
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then(async (data: IBK) => {
  //       await Promise.all([
  //         setRecurringExpenses(data.recurringExpenses),
  //         setEntries(data.entries),
  //         ...BKHighlights.map(async (highlight) => {
  //           switch (highlight) {
  //             case 'Revenue': {
  //               setRevenueEntries(
  //                 data.entries.filter(
  //                   (entry) => entry.transaction_type === 'Income',
  //                 ),
  //               );
  //               break;
  //             }
  //             case 'Expenses': {
  //               setExpenseEntries(
  //                 data.entries.filter(
  //                   (entry) => entry.transaction_type === 'Expense',
  //                 ),
  //               );
  //               break;
  //             }
  //           }
  //         }),
  //       ]);
  //     });
  // }
  // }, []);

  useEffect(() => {
    fetchEntries;
  }, [fetchEntries]);

  return (
    <div className='bookkeeping-container'>
      <div className='bookkeeping-header'>
        <h2>Bookkeeping</h2>
        <div>
          <select
            className='sort-options'
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {dateOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button onClick={() => setAddingEntry(!addingEntry)}>
            Add New Entry
          </button>
        </div>
      </div>
      <div className='bookkeeping-top-container'>
        <h3>Overview</h3>
        <div>
          {entries.length === 0 ? (
            <p className='no-entries-info'>
              Overview info will appear here once entries are added.
            </p>
          ) : (
            <div className='bookkeeping-highlights'>
              <BKHighlight highlight='Profit' entries={dateFilter(entries)} />
              <BKHighlight
                highlight='Expense'
                entries={dateFilter(expenseEntries)}
              />
              <BKHighlight
                highlight='Revenue'
                entries={dateFilter(revenueEntries)}
              />
              <BKHighlight
                highlight='Outstanding'
                entries={dateFilter(revenueEntries)}
              />
            </div>
          )}
        </div>
      </div>
      <div className='bookkeeping-bottom-container'>
        <div className='bookkeeping-main'>
          <div className='bookkeeping-main-options'>
            <div className='bookkeeping-filters'>
              {filterOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => setSelectedFilter(option)}
                  className={`sort-capsule ${option} ${
                    selectedFilter === option ? 'selected' : ''
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
            <div>
              <select
                className='sort-options'
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                {sortOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            {entries.length === 0 ? (
              <p className='no-entries-info'>Entries will appear here</p>
            ) : (
              <div className='bookkeeping-entries'>
                <BKEntryRowLabel />
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.bookkeeping_id}
                    onClick={() => toggleEntry(entry)}
                  >
                    <BKEntryRow key={entry.bookkeeping_id} entry={entry} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='bookkeeping-right-column'>
          <h3>Recurring Expenses</h3>
          <button
            className='add-expense'
            onClick={() => {
              setAddingExpense(true);
            }}
          >
            Add
          </button>
          {recurringExpenses.length === 0 ? (
            <p className='no-entries-info'>
              Recurring Expenses will appear here once added.
            </p>
          ) : (
            <div>
              {recurringExpenses.map((expense) => (
                <RecurringExpense key={expense.re_id} expense={expense} />
              ))}
            </div>
          )}

     
        </div>
      </div>
      {addingEntry && (
        <NewBKEntry setAddingEntry={setAddingEntry} id={user.account?.id} />
      )}
      {addingExpense && (
        <NewExpense
          setAddingExpense={setAddingExpense}
          accountID={user.account?.id}
        />
      )}
    </div>
  );
};

export default Bookkeeping;