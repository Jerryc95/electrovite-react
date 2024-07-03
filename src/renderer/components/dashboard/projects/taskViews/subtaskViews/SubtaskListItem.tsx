import React, { useState, ChangeEvent } from 'react';

import { taskStatus } from '../../../../../../statuses/taskStatus';
import { Subtask } from 'src/models/subtask';
import { useUpdateSubtaskMutation } from '../../../../../../services/subtaskAPI';

interface SubtaskListItemProps {
  subtask: Subtask;
}

const SubtaskListItem: React.FC<SubtaskListItemProps> = ({ subtask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(subtask.subtask_status);

  const [updateSubtask] = useUpdateSubtaskMutation();

  const dateParser = (date: Date) => {
    return new Date(date);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setStatus(subtask.subtask_status);
  };

  const handleSaveClick = async () => {
    const updatedSubtask: Subtask = {
      subtask_id: subtask.subtask_id,
      task_id: subtask.task_id,
      name: subtask.name,
      description: subtask.description,
      notes: subtask.notes,
      creation_date: subtask.creation_date,
      start_date: subtask.start_date,
      due_date: subtask.due_date,
      subtask_status: status,
      priority: subtask.priority,
      column_index: subtask.column_index,
    };
    updateSubtask(updatedSubtask);
    setIsEditing(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  return (
    <div className='task-list-item-container'>
      <p className='subtask-name'>{subtask.name}</p>
      <p className={`subtask-priority ${subtask.priority}`}>
        {subtask.priority}
      </p>
      <p className='subtask-status'>
        <div className='edit-field-section'>
          {isEditing ? (
            <div className='edit-field-container'>
              <select
                className='edit-field-input'
                value={status}
                onChange={handleInputChange}
              >
                {Object.values(taskStatus).map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button className='edit-field-button' onClick={handleSaveClick}>
                Save
              </button>
              <button
                className='edit-field-cancel-button'
                onClick={handleEditClick}
              >
                Cancel
              </button>
            </div>
          ) : (
            <span
              className='edit-field-content'
              onClick={handleEditClick}
              style={{ cursor: 'pointer' }}
            >
              {status}
            </span>
          )}
        </div>
      </p>
      <p className='subtask-due-date'>
        {dateParser(subtask.due_date).toLocaleDateString()}
      </p>
    </div>
  );
};

export default SubtaskListItem;
