import DeleteModal from '$renderer/components/DeleteModal';
import React, { useState } from 'react';
import { RecurringTask } from 'src/models/recurringTask';
import {
  useRemoveRecurringTaskMutation,
  useUpdateRecurringTaskMutation,
} from '../../../../../services/recurringTaskAPI';

interface EditRecurringTaskProps {
  recurringTask: RecurringTask;
  setEditRecurringTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditRecurringTask: React.FC<EditRecurringTaskProps> = ({
  recurringTask,
  setEditRecurringTask,
}) => {
  const frequencies = ['Daily', 'Weekly', 'Monthly'];

  const [taskName, setTaskName] = useState(recurringTask.task);
  const [frequency, setFrequency] = useState(recurringTask.frequency);
  const [showingDeleteAlert, setShowingDeleteAlert] = useState(false);

  const [removeRecurringTask] = useRemoveRecurringTaskMutation();
  const [updateRecurringTask] = useUpdateRecurringTaskMutation();

  const toggleDeleteProject = () => {
    setShowingDeleteAlert(!showingDeleteAlert);
  };

  const handleDeleteRecurringTask = () => {
    removeRecurringTask(recurringTask.rt_id);
    setShowingDeleteAlert(false);
  };

  const handleUpdateRecurringTask = () => {
    const updatedRecurringTask: RecurringTask = {
      rt_id: recurringTask.rt_id,
      account_id: recurringTask.account_id,
      task: taskName,
      frequency: frequency,
      is_completed: recurringTask.is_completed,
      last_updated_at: recurringTask.last_updated_at
    }
    updateRecurringTask(updatedRecurringTask)
    setEditRecurringTask(false)
  };

  return (
    <div className='new-item-container'>
      <div className='new-item-form'>
        <div className='new-item-heading'>
          <h2>Edit Recurring Task</h2>
          <button
          className='button-brand-magenta'
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
                  value={taskName}
                  onChange={(e) => {
                    setTaskName(e.target.value);
                  }}
                />
              </label>
              <label className='new-item-label'>
                Frequency
                <select
                  className='new-item-input'
                  value={frequency}
                  onChange={(e) => {
                    setFrequency(e.target.value);
                  }}
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
                  <button onClick={handleUpdateRecurringTask}>Update</button>
                </div>
                <div className='new-item-delete-button'>
                  <button onClick={toggleDeleteProject}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showingDeleteAlert && (
        <DeleteModal
          onDelete={handleDeleteRecurringTask}
          setShowingModal={setShowingDeleteAlert}
          item='Recurring Task'
        />
      )}
    </div>
  );
};

export default EditRecurringTask;
