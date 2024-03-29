import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import { Subtask } from 'src/models/subTask';
import { taskStatus } from '../../../../../statuses/taskStatus';

interface NewSubtaskProps {
  setAddingSubtask: React.Dispatch<React.SetStateAction<boolean>>;
  accountID: number | undefined;
  taskID: number;
  // setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  // subTasks: Subtask[];
}

const NewSubtask: React.FC<NewSubtaskProps> = ({
  setAddingSubtask,
  accountID,
  taskID,
  // setSubtasks,
  // subTasks,
}) => {
    const today = new Date();
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(nextMonth);
  

  const handleCreateNewSubtask = async () => {
    const url = 'http://localhost:3000/subtasks/add';
    const newSubtask = {
      name: name,
      accountID: accountID,
      taskID: taskID,
      description: description,
      startDate: startDate,
      dueDate: endDate,
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubtask),
      });
      const responseData = await response.json();
      const responseSubtask: Subtask = {
        subtask_id: responseData.subtask_id,
        task_id: responseData.task_id,
        name: responseData.name,
        description: responseData.description,
        notes: responseData.notes,
        creation_date: responseData.creation_date,
        start_date: responseData.start_date,
        due_date: responseData.due_date,
        subtask_status: responseData.subtask_status,
        completed: responseData.completed,
        priority: responseData.priority, 
        column_index: responseData.column_index,
      }

      console.log(responseData)
      // setSubtasks((t) => [...t, responseSubtask]);
      setAddingSubtask(false);
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <div className='new-project-container'>
      <div className='new-project-form'>
        <div className='new-project-heading'>
          <h2>Adding Subtask</h2>
          <button onClick={() => setAddingSubtask(false)}>Cancel</button>
        </div>
        <div className='new-project-details'>
          <div className='new-project-info'>
            <label className='new-project-label'>
              Subtask
              <input
                className='new-project-name-input'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className='new-project-label'>
              Subtask Description
              <textarea
                className='new-project-description-input'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span> {`${description.length} / 150 Characters`}</span>
            </label>
          </div>
          <div className='new-project-date-picker'>
            <h3>Start Date</h3>
            <DatePicker
              showIcon
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className='new-project-date-input'
              startDate={startDate}
              endDate={endDate}
            />
            <h3>End Date</h3>
            <DatePicker
              showIcon
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className='new-project-date-input'
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </div>
        </div>
        <div className='new-project-create-button'>
          <button onClick={handleCreateNewSubtask}>Add Subtask</button>
        </div>
      </div>
    </div>
  );
};

export default NewSubtask;
