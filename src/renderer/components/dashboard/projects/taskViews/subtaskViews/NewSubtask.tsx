import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import { Subtask } from '../../../../../../models/subTask';
import { taskStatus } from '../../../../../../statuses/taskStatus';
import { useAddSubtaskMutation } from '../../../../../../services/subtaskAPI';

interface NewSubtaskProps {
  setAddingSubtask: React.Dispatch<React.SetStateAction<boolean>>;
  accountID: number | undefined;
  taskID: number;
  subtasks: Subtask[];
}

const NewSubtask: React.FC<NewSubtaskProps> = ({
  setAddingSubtask,
  accountID,
  taskID,
  subtasks,
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

  const [addSubtask] = useAddSubtaskMutation();

  const handleCreateNewSubtask = async () => {
    const index = subtasks
      .filter((t) => t.subtask_status === taskStatus.NotStarted)
      .reduce(
        (acc, subtask) =>
          acc > subtask.column_index ? acc : subtask.column_index + 1,
        0,
      );
    const newSubtask = {
      name: name,
      accountID: accountID,
      taskID: taskID,
      description: description,
      startDate: startDate,
      dueDate: endDate,
      columnIndex: index,
    };
    addSubtask(newSubtask);
    setAddingSubtask(false);
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
          <button className='button-brand-blue' onClick={handleCreateNewSubtask}>Add Subtask</button>
        </div>
      </div>
    </div>
  );
};

export default NewSubtask;
