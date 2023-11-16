import React, { useState, ChangeEvent } from 'react';

import ProgressBar from '$renderer/components/ProgressBar';
import { taskStatus } from '../../../../../../statuses/taskStatus';
import { Subtask } from 'src/models/subTask';

interface SubtaskListItemProps {
  subtask: Subtask;
}

const SubtaskListItem: React.FC<SubtaskListItemProps> = ({ subtask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(subtask.subtask_status);

  const dateParser = (date: Date) => {
    return new Date(date);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setStatus(subtask.subtask_status);
  };

  const handleSaveClick = async () => {
    subtask.subtask_status = status;
    setIsEditing(false);
    const data = {
      status: subtask.subtask_status,
    };
    const url = `http://localhost:3000/subtasks/update/${subtask.subtask_id}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update value');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  return (
    <div className='task-list-item-container'>
      <p className='subtask-name'>{subtask.name}</p>
      <p className={`subtask-priority ${subtask.priority}`}>{subtask.priority}</p>
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
            <p
              className='edit-field-content'
              onClick={handleEditClick}
              style={{ cursor: 'pointer' }}
            >
              {status}
            </p>
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
