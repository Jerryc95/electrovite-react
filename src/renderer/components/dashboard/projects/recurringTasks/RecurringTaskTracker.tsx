import ProgressBar from '$renderer/components/ProgressBar';
import React, { useState, useEffect } from 'react';
import { RecurringTask } from 'src/models/recurringTask';

interface RecurringTaskTrackerProps {
  label: string;
  recurringTasks: RecurringTask[];
}

const RecurringTaskTracker: React.FC<RecurringTaskTrackerProps> = ({
  label,
  recurringTasks,
}) => {
  const [tasks, setTasks] = useState<RecurringTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<RecurringTask[]>([]);

  useEffect(() => {
    let filteredTasks = [];
    let filteredCompletedTasks = [];
    switch (label) {
      case 'Daily Tasks': {
        filteredTasks = recurringTasks.filter(
          (task) => task.frequency === 'Daily',
        );
        filteredCompletedTasks = recurringTasks.filter(
          (task) => task.frequency === 'Daily' && task.is_completed === true,
        );
        setTasks(filteredTasks);
        setCompletedTasks(filteredCompletedTasks);
        break;
      }
      case 'Weekly Tasks': {
        filteredTasks = recurringTasks.filter(
          (task) => task.frequency === 'Weekly',
        );
        filteredCompletedTasks = recurringTasks.filter(
          (task) => task.frequency === 'Weekly' && task.is_completed === true,
        );
        setTasks(filteredTasks);
        setCompletedTasks(filteredCompletedTasks);
        break;
      }
      case 'Monthly Tasks': {
        filteredTasks = recurringTasks.filter(
          (task) => task.frequency === 'Monthly',
        );
        filteredCompletedTasks = recurringTasks.filter(
          (task) => task.frequency === 'Monthly' && task.is_completed === true,
        );
        setTasks(filteredTasks);
        setCompletedTasks(filteredCompletedTasks);
        break;
      }
    }
  }, [recurringTasks, label]);

  return (
    <div
      className='small-card-container justify-content-between'
      style={{ width: '250px', height: '65px' }}
      onClick={() => console.log(completedTasks, tasks)}
    >
      <div className='card-row'>
        <h5>{label}</h5>
      </div>
      <div className='card-row align-items-center'>
        <ProgressBar height={10} total={tasks.length} current={completedTasks.length} />
      </div>
    </div>
  );
};

export default RecurringTaskTracker;
