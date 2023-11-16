import React, { useState, useEffect } from 'react';
import { RecurringTask } from 'src/models/recurringTask';
import '../../../../styles/components/card.scss';
import '../../../../styles/styledEffects.scss';

interface RecurringTaskProps {
  recurringTask: RecurringTask;
}

const RecurringTaskView: React.FC<RecurringTaskProps> = ({ recurringTask }) => {
  const [isCompleted, setIsCompleted] = useState(recurringTask.is_completed);
  const [labelColor, setLabelColor] = useState('');

  const handleCompletionChange = async (value: boolean) => {
    setIsCompleted(value);
    const updatedTask = {
      isCompleted: value,
    };
    const urlBase = 'http://localhost:3000';
    const apiUrl = `/projects/update/task/${recurringTask.rt_id}`;
    const url = urlBase + apiUrl;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        throw new Error('Failed to update value');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentWeek =
      Math.ceil(
        ((currentDate.getTime() -
          new Date(currentDate.getFullYear(), 0, 4).getTime()) /
          86400000 +
          1) /
          7,
      ) + 1;
    const currentMonth = currentDate.getMonth();
    const lastUpdatedDate = new Date(recurringTask.last_updated_at);

    switch (recurringTask.frequency) {
      case 'Daily': {
        setLabelColor('brand-pink');
        if (lastUpdatedDate.getDay() < currentDay) {
          //   setIsCompleted(false);
          handleCompletionChange(false);
        }
        break;
      }
      case 'Weekly': {
        setLabelColor('brand-blue');
        if (
          Math.ceil(
            ((lastUpdatedDate.getTime() -
              new Date(lastUpdatedDate.getFullYear(), 0, 4).getTime()) /
              86400000 +
              1) /
              7,
          ) < currentWeek
        ) {
          handleCompletionChange(false);
        }
        break;
      }
      case 'Monthly': {
        setLabelColor('brand-purple');
        if (lastUpdatedDate.getMonth() < currentMonth) {
          handleCompletionChange(false);
        }
        break;
      }
    }
  }, []);

  return (
    <div
      className='thin-card-container justify-content-center hoverable'
      style={{ height: '70px' }}
    >
      <div className='card-row align-items-center'>
        <label className='checkbox-container '>
          <input
            className='checkbox'
            type='checkbox'
            checked={isCompleted}
            onChange={() => handleCompletionChange(!isCompleted)}
          />
          <span className='checkmark'></span>
        </label>
        <div className='card-column justify-content-start'>
          <h5>{recurringTask.task}</h5>

          <p className={`subtitle ${labelColor}`}>{recurringTask.frequency}</p>
        </div>
      </div>
    </div>
  );
};

export default RecurringTaskView;
