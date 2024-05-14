import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import { RecurringTask } from 'src/models/recurringTask';
import '../../../../styles/components/card.scss';
import '../../../../styles/styledEffects.scss';
import EditRecurringTask from './EditRecurringTask';
import { useUpdateRecurringTaskMutation } from '../../../../../services/recurringTaskAPI';

interface RecurringTaskProps {
  recurringTask: RecurringTask;
}

const RecurringTaskView: React.FC<RecurringTaskProps> = ({ recurringTask }) => {
  const [isCompleted, setIsCompleted] = useState(recurringTask.is_completed);
  // const [labelColor, setLabelColor] = useState('');
  const [editingTask, setEditingTask] = useState(false);

  const [updateRecurringTask] = useUpdateRecurringTaskMutation();

  const handleCompletionChange = (value: boolean, updatedTime: Date) => {
    setIsCompleted(value);
    const updatedRecurringTask: RecurringTask = {
      rt_id: recurringTask.rt_id,
      account_id: recurringTask.account_id,
      task: recurringTask.task,
      frequency: recurringTask.frequency,
      is_completed: value,
      last_updated_at: updatedTime,
    };
    updateRecurringTask(updatedRecurringTask);
  };

  const handleFrequencyReset = useCallback(() => {
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
        if (lastUpdatedDate.getDay() < currentDay) {
          handleCompletionChange(false, currentDate);
        }
        break;
      }
      case 'Weekly': {
        const isSameWeek =
        lastUpdatedDate.getFullYear() === currentDate.getFullYear() &&
        Math.floor((lastUpdatedDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 604800000) ===
        Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 604800000);
    
      if (!isSameWeek) {
        handleCompletionChange(false, currentDate);
      }
        // if (
        //   Math.ceil(
        //     ((lastUpdatedDate.getTime() -
        //       new Date(lastUpdatedDate.getFullYear(), 0, 4).getTime()) /
        //       86400000 +
        //       1) /
        //       7,
        //   ) <
        //   currentWeek
        // ) {
  
        //   handleCompletionChange(false, currentDate);
        // }
        break;
      }
      case 'Monthly': {
        if (lastUpdatedDate.getMonth() < currentMonth) {
          console.log('here');
          handleCompletionChange(false, currentDate);
        }
        break;
      }
    }
  }, []);

  useEffect(() => {
    handleFrequencyReset();
  }, [handleFrequencyReset]);

  // useEffect(() => {
  //   const currentDate = new Date();
  //   const currentDay = currentDate.getDay();
  //   const currentWeek =
  //     Math.ceil(
  //       ((currentDate.getTime() -
  //         new Date(currentDate.getFullYear(), 0, 4).getTime()) /
  //         86400000 +
  //         1) /
  //         7,
  //     ) + 1;
  //   const currentMonth = currentDate.getMonth();
  //   const lastUpdatedDate = new Date(recurringTask.last_updated_at);

  //   switch (recurringTask.frequency) {
  //     case 'Daily': {
  //       setLabelColor('brand-pink');
  //       if (lastUpdatedDate.getDay() < currentDay) {
  //         handleCompletionChange(false);
  //       }
  //       break;
  //     }
  //     case 'Weekly': {
  //       setLabelColor('brand-blue');
  //       if (
  //         Math.ceil(
  //           ((lastUpdatedDate.getTime() -
  //             new Date(lastUpdatedDate.getFullYear(), 0, 4).getTime()) /
  //             86400000 +
  //             1) /
  //             7,
  //         ) < currentWeek
  //       ) {
  //         handleCompletionChange(false);
  //       }
  //       break;
  //     }
  //     case 'Monthly': {
  //       setLabelColor('brand-purple');
  //       if (lastUpdatedDate.getMonth() < currentMonth) {
  //         handleCompletionChange(false);
  //       }
  //       break;
  //     }
  //   }
  // }, []);

  return (
    <div
      className='thin-card-container justify-content-center'
      style={{ height: '70px' }}
    >
      <div className='card-row align-items-center justify-content-between'>
        <div className='card-row align-items-center'>
          <label className='checkbox-container '>
            <input
              className='checkbox'
              type='checkbox'
              checked={isCompleted}
              onChange={() =>
                handleCompletionChange(
                  !isCompleted,
                  recurringTask.last_updated_at,
                )
              }
            />
            <span className='checkmark'></span>
          </label>
          <div className='card-column justify-content-start'>
            <h5>{recurringTask.task}</h5>
            <p className={`subtitle ${recurringTask.frequency}`}>
              {recurringTask.frequency}
            </p>
          </div>
        </div>
        <FontAwesomeIcon
          onClick={() => setEditingTask(true)}
          icon={faPenToSquare}
          className='card-edit-icon'
        />
      </div>
      {editingTask && (
        <EditRecurringTask
          setEditRecurringTask={setEditingTask}
          recurringTask={recurringTask}
        />
      )}
    </div>
  );
};

export default RecurringTaskView;
