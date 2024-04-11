import React, { useState } from 'react';
import { RecurringTask } from 'src/models/recurringTask';

interface EditRecurringTaskProps {
  recurringTask: RecurringTask;
  setEditRecurringTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditRecurringTask: React.FC<EditRecurringTaskProps> = ({
  recurringTask,
  setEditRecurringTask,
}) => {
  const frequencies = ['Daily', 'Weekly', 'Monthly'];

  return (
    <div className='new-item-container'>
      <div className='new-item-form'>
        <div className='new-item-heading'>
          <h2>New Recurring Task</h2>
          <button
            onClick={() => {
              setEditRecurringTask(false);
            }}
          >
            Cancel
          </button>
        </div>
        <div className='new-item-details-container'>
          <div className='new-item-details jc-cen'>
            <div className='new-item-detail-column'>
              <label className='new-item-label'>
                Editing Recurring Task
                <input
                  className='new-item-input'
                  type='text'
                  value={recurringTask.task}
                  //   onChange={(e) => {
                  //     setTask(e.target.value);
                  //   }}
                />
              </label>
              <label className='new-item-label'>
                Frequency
                <select
                  className='new-item-input'
                  value={recurringTask.frequency}
                  //   onChange={(e) => {
                  //     setFrequency(e.target.value);
                  //   }}
                >
                  {frequencies.map((frequency, index) => (
                    <option key={index} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
              </label>
              <div className='new-item-button-row'>
                <div className='new-item-create-button'>
                  <button>Update</button>
                </div>
                <div className='new-item-delete-button'>
                  <button>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecurringTask;
