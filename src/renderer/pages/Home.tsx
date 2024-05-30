import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faCalendar } from '@fortawesome/free-solid-svg-icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import '../styles/Home.scss';
import { parseDate } from '../../helpers/ParseDate';
import { BKEntry } from 'src/models/BKEntry';
import { Contact } from 'src/models/contact';
import UpcomingEventView from '$renderer/components/dashboard/contacts/events/UpcomingEventView';
import UpcomingTaskView from '$renderer/components/dashboard/home/UpcomingTaskView';
import NewClientsBox from '$renderer/components/dashboard/home/NewClientsBox';
import InvoiceInfoBox from '$renderer/components/dashboard/home/InvoiceInfoBox';
import {
  useFetchExpensesQuery,
  useFetchRevenueQuery,
  useFetchUpcomingEventsQuery,
  useFetchUpcomingTasksQuery,
} from '../../services/homeAPI';
import {
  getExpenses,
  getRevenue,
  getUpcomingEvents,
  getUpcomingTasks,
} from '../../services/homeSlice';
import { getUser } from '../../services/accountSlice';
import RecurringExpenseBox from '$renderer/components/dashboard/home/RecurringExpenseBox';
import BlurredOverlay from '$renderer/components/BlurredOverlay';
import { getSubscription } from '../../services/subscriptionSlice';

interface IRevenueEntryData {
  date: string;
  amount: number;
}

interface IRevenueChartData {
  name: string;
  data: IRevenueEntryData[];
  stroke: string;
  opacity: number;
}

const Home: React.FC = () => {
  const user = useSelector(getUser);
  const subscription = useSelector(getSubscription);
  const upcomingTasks = useSelector(getUpcomingTasks);
  const upcomingEvents = useSelector(getUpcomingEvents);
  const recurringExpenses = useSelector(getExpenses);
  const revenue = useSelector(getRevenue);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [timeOfDay, setTimeOfDay] = useState('Morning');
  const [timeIcon, setTimeIcon] = useState(faSun);
  // const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
  // const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [revenueEntries, setRevenueEntries] = useState<IRevenueChartData[]>([]);
  //   const [uncompletedSubtasks, setUncompletedSubtasks] = useState(0);
  //   const [completedSubtasks, setCompletedSubtasks] = useState(0);
  //   const [totalSubtasks, setTotalSubtasks] = useState(uncompletedSubtasks + completedSubtasks);

  const fetchTasks = useFetchUpcomingTasksQuery(user.account?.id, {
    refetchOnMountOrArgChange: true,
  });
  const fetchEvents = useFetchUpcomingEventsQuery(user.account?.id, {
    refetchOnMountOrArgChange: true,
  });
  const fetchRevenue = useFetchRevenueQuery(user.account?.id, {
    refetchOnMountOrArgChange: true,
  });
  const fetchExpenses = useFetchExpensesQuery(user.account?.id);

  // const today = new Date();
  const today = useMemo(() => new Date(), []);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const timeDifference = (date: Date) => {
    return Math.ceil(
      (today.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  const YAxisFormatter = (amount: number) => {
    if (amount > 1000000000) {
      return '$' + (amount / 1000000000).toString() + 'B';
    } else if (amount > 1000000) {
      return '$' + (amount / 1000000).toString() + 'M';
    } else if (amount > 1000) {
      return '$' + (amount / 1000).toString() + 'K';
    } else {
      return '$' + amount.toString();
    }
  };

  const handleSetRevenueEntries = (entries: BKEntry[], daysAgo: number) => {
    const historicEntries: IRevenueEntryData[] = [];
    const recentEntries: IRevenueEntryData[] = [];

    let previousHistoricRevenue = 0;
    let previousRecentRevenue = 0;

    //Used to increment the past entry's date to overlay data on chart (sept 1st overlays with oct 1st)
    const entryDate = new Date(
      today.getTime() - (daysAgo / 2) * 1000 * 60 * 60 * 24,
    );
    const pastTargetDate = new Date(
      today.getTime() - daysAgo * 1000 * 60 * 60 * 24,
    );
    const historicEntryDate = new Date(entryDate);

    // loop through the past target date to today to create all array items.
    // then checks if the time difference is between the past target date and half of that.
    // if it is between, push a new item to the historic array else push it into the recent array
    while (pastTargetDate < today) {
      if (timeDifference(pastTargetDate) > daysAgo / 2) {
        const newChartData: IRevenueEntryData = {
          date: pastTargetDate.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          }),
          amount: 0,
        };
        historicEntries.push(newChartData);
      } else {
        const newChartData: IRevenueEntryData = {
          date: pastTargetDate.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          }),
          amount: 0,
        };
        recentEntries.push(newChartData);
      }

      pastTargetDate.setDate(pastTargetDate.getDate() + 1);
      historicEntryDate.setDate(historicEntryDate.getDate() + 1);
    }
    // loop through the historic array and check if a user entry's date matches a date,
    // if it does, set the amount to the entry amount and increment it and set the previous revenue to it.
    // If it doesn't, set the date's amount to the previous revenue.
    historicEntries.forEach((entry) => {
      const entryDay = new Date(entry.date);
      for (let i = 0; entries.length > i; i++) {
        if (
          parseDate(entries[i].entry_date).getDate() === entryDay.getDate() &&
          parseDate(entries[i].entry_date).getMonth() === entryDay.getMonth()
        ) {
          entry.amount = parseFloat(entries[i].total_amount);
          previousHistoricRevenue += entry.amount;
        } else {
          entry.amount = previousHistoricRevenue;
        }
      }

      // Add 30 days to the historic entry's date to match the date with the recent entry array
      // to allow the line graphs to overlap
      const entryDate = new Date(entryDay);
      entryDate.setDate(entryDate.getDate() + 30);
      entry.date = entryDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    });
    // loop through the recent array and check if a user entry's date matches a date,
    // if it does, set the amount to the entry amount and increment it and set the previous revenue to it.
    // If it doesn't, set the date's amount to the previous revenue.
    recentEntries.forEach((entry) => {
      const entryDay = new Date(entry.date);
      for (let i = 0; entries.length > i; i++) {
        if (
          parseDate(entries[i].entry_date).getDate() === entryDay.getDate() &&
          parseDate(entries[i].entry_date).getMonth() === entryDay.getMonth()
        ) {
          entry.amount = parseFloat(entries[i].total_amount);
          previousRecentRevenue += entry.amount;
        } else {
          entry.amount = previousRecentRevenue;
        }
      }
    });

    const rawChartData: IRevenueChartData[] = [
      {
        name: 'Prior Month',
        data: historicEntries,
        stroke: '#4cc9f0',
        opacity: 0.4,
      },
      {
        name: '30 Days',
        data: recentEntries,
        stroke: '#480ca8',
        opacity: 1.0,
      },
    ];
    setRevenueEntries(rawChartData);
  };

  useEffect(() => {
    const currentHour = today.getHours();

    if (currentHour >= 5 && currentHour < 12) {
      setTimeOfDay('Morning');
      setTimeIcon(faSun);
    } else if (currentHour >= 12 && currentHour < 17) {
      setTimeOfDay('Afternoon');
      setTimeIcon(faSun);
    } else if (currentHour >= 17 && currentHour < 20) {
      setTimeOfDay('Evening');
      setTimeIcon(faMoon);
    } else if (currentHour >= 20 && currentHour < 4) {
      setTimeOfDay('Night');
      setTimeIcon(faMoon);
    }
  }, [today]);

  useEffect(() => {
    fetchEvents;
    fetchTasks;
    fetchRevenue;
    fetchExpenses;
    handleSetRevenueEntries(revenue, 60);
  }, []);
  return (
    <div className='home-container'>
      <div className='home-header'>
        <h2>
          Good {timeOfDay}, {user.accountProfile?.first_name}!{' '}
          <FontAwesomeIcon size='sm' icon={timeIcon} />
        </h2>
        <div className='row date'>
          <p>{today.toLocaleDateString(undefined, options)}</p>
          <FontAwesomeIcon size='sm' icon={faCalendar} />
        </div>
      </div>
      <h3>Upcoming Tasks</h3>
      <div className='home-row'>
        {upcomingTasks.length > 0 ? (
          <>
            {upcomingTasks.map((upcomingTask) => (
              <div className='margin' key={upcomingTask.task_id}>
                <UpcomingTaskView upcomingTask={upcomingTask} />
              </div>
            ))}
          </>
        ) : (
          <p className='info-text'>
            It looks like you're all caught up on your upcoming tasks!
          </p>
        )}
      </div>
      <h3>Upcoming Events</h3>
      <div className='home-row'>
        {upcomingEvents.length > 0 ? (
          <>
            {upcomingEvents.map((event) => (
              <div className='margin'>
                <UpcomingEventView upcomingEvent={event} />
              </div>
            ))}
          </>
        ) : (
          <p className='info-text'>
            Looks like there are no upcoming events coming up.
          </p>
        )}
      </div>
      <h3>Finances</h3>
      <BlurredOverlay
        blur={subscription!.tier > 2 ? 0 : 8}
        allowed={subscription!.tier > 2 ? true : false}
        text="Subscribe to Flowplanr Pro to unlock Finances"
      >
        <div className='home-row'>
          <div className='home-col'>
            <NewClientsBox id={user.account?.id} />
            <InvoiceInfoBox label='Overdue Invoices' invoices={[]} />
            <InvoiceInfoBox label='Paid Invoices' invoices={[]} />
            <RecurringExpenseBox recurringExpenses={recurringExpenses} />
          </div>
          <div className='revenue-chart-container'>
            <div className='home-row margin space-between'>
              <h4>Revenue</h4>
              <h5>Last 30 Days vs prior Month</h5>
            </div>

            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                margin={{
                  top: 20,
                  right: 30,
                  // left: 20,
                  bottom: 75,
                }}
              >
                <XAxis
                  dataKey='date'
                  allowDuplicatedCategory={false}
                  interval={6}
                />
                <YAxis tickFormatter={YAxisFormatter} />
                <Tooltip />
                <Legend />
                {revenueEntries.map((entries) => (
                  <Line
                    type='monotoneY'
                    dataKey='amount'
                    data={entries.data}
                    name={entries.name}
                    key={entries.name}
                    stroke={entries.stroke}
                    dot={false}
                    strokeWidth={3}
                    opacity={entries.opacity}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </BlurredOverlay>
    </div>
  );
};

export default Home;
