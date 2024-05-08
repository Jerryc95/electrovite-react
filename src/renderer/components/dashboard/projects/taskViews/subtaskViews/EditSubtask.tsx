import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

import DeleteModal from '$renderer/components/DeleteModal';
import { Subtask } from 'src/models/subtask';
import {
  useRemoveSubtaskMutation,
  useUpdateSubtaskMutation,
} from '../../../../../../services/subtaskAPI';
import DropdownField from '$renderer/components/DropdownField';
import { priorityStatus } from '../../../../../../statuses/priorityStatus';

interface EditSubtaskProps {
  subtask: Subtask;
  setEditingSubtask: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditSubtask: React.FC<EditSubtaskProps> = ({
  subtask,
  setEditingSubtask,
}) => {
  const [name, setName] = useState(subtask.name);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [showingDeleteAlert, setShowingDeleteAlert] = useState(false);

  const [removeSubtask] = useRemoveSubtaskMutation();
  const [updateSubtask] = useUpdateSubtaskMutation();

  const toggleDeleteSubtask = () => {
    setShowingDeleteAlert(!showingDeleteAlert);
  };

  const handleDeleteSubtask = () => {
    removeSubtask(subtask.subtask_id);
    setEditingSubtask(false);
    setShowingDeleteAlert(false);
  };

  const handleUpdateSubtask = async () => {
    console.log(subtask);
    if (startDate !== null && startDate !== undefined) {
      const data: Subtask = {
        subtask_id: subtask.subtask_id,
        task_id: subtask.task_id,
        name: name,
        description: subtask.description,
        notes: subtask.notes,
        creation_date: subtask.creation_date,
        start_date: startDate,
        due_date: subtask.due_date,
        subtask_status: subtask.subtask_status,
        priority: subtask.priority,
        column_index: subtask.column_index,
      };
      updateSubtask(data);
    } else if (endDate !== null && endDate !== undefined) {
      const data: Subtask = {
        subtask_id: subtask.subtask_id,
        task_id: subtask.task_id,
        name: name,
        description: subtask.description,
        notes: subtask.notes,
        creation_date: subtask.creation_date,
        start_date: subtask.start_date,
        due_date: endDate,
        subtask_status: subtask.subtask_status,
        priority: subtask.priority,
        column_index: subtask.column_index,
      };
      updateSubtask(data);
    } else {
      const data: Subtask = {
        subtask_id: subtask.subtask_id,
        task_id: subtask.task_id,
        name: name,
        description: subtask.description,
        notes: subtask.notes,
        creation_date: subtask.creation_date,
        start_date: subtask.start_date,
        due_date: subtask.due_date,
        subtask_status: subtask.subtask_status,
        priority: subtask.priority,
        column_index: subtask.column_index,
      };
      updateSubtask(data);
    }

    setEditingSubtask(false);
  };

  useEffect(() => {
    const currentStartDate = new Date(subtask.start_date);
    const currentEndDate = new Date(subtask.due_date);
    setStartDate(currentStartDate);
    setEndDate(currentEndDate);
  }, [subtask.due_date, subtask.start_date]);

  return (
    <div className='edit-project-container'>
      <div className='edit-project-form'>
        <div className='edit-project-heading'>
          <h2>Edit Subtask</h2>
          <button onClick={() => setEditingSubtask(false)}>Cancel</button>
        </div>
        <div className='edit-project-details'>
          <div className='edit-project-info'>
            {/* <div className='row space-between'> */}
            <label className='edit-project-label'>
              Edit Subtask Name
              <input
                className='edit-project-name-input'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className='dropdown-edit'>
            <DropdownField
                label='Priority:'
                field='priority'
                value={subtask.priority}
                item={subtask}
                options={priorityStatus}
                onEdit={handleUpdateSubtask}
              />
            </div>
            <div className='edit-dates'>
              <div className='edit-project-date-picker'>
                <h3>Start Date</h3>
                <DatePicker
                  showIcon
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className='edit-project-date-input'
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
              <div className='edit-project-date-picker'>
                <h3>End Date</h3>
                <DatePicker
                  showIcon
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className='edit-project-date-input'
                  startDate={subtask.start_date}
                  endDate={endDate}
                  minDate={subtask.start_date}
                />
              </div>
            </div>

            <div className='edit-buttons'>
              <button
                className='button-brand-lighter-blue'
                onClick={() => handleUpdateSubtask()}
              >
                Update
              </button>
              <button
                className='button-brand-pink'
                onClick={toggleDeleteSubtask}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {showingDeleteAlert && (
        <DeleteModal
          onDelete={handleDeleteSubtask}
          setShowingModal={setShowingDeleteAlert}
          item='task'
        />
      )}
    </div>
  );
};

export default EditSubtask;
