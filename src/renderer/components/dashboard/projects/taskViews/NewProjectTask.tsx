import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import { useAddTaskMutation } from '../../../../../services/taskAPI';
import { Task } from 'src/models/task';
import { taskStatus } from '../../../../../statuses/taskStatus';

interface NewProjectTaskProps {
  setAddingTask: React.Dispatch<React.SetStateAction<boolean>>;
  accountID: number | undefined;
  projectID: number;
  tasks: Task[];
}

const NewProjectTask: React.FC<NewProjectTaskProps> = ({
  setAddingTask,
  accountID,
  projectID,
  tasks,
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

  const [addTask] = useAddTaskMutation();

  const handleCreateNewTask = async () => {
    const index = tasks
      .filter((t) => t.task_status === taskStatus.NotStarted)
      .reduce(
        (acc, task) => (acc > task.column_index ? acc : task.column_index + 1),
        0,
      );

    const newTask = {
      name: name,
      accountID: accountID,
      description: description,
      startDate: startDate,
      dueDate: endDate,
      projectID: projectID,
      columnIndex: index,
    };

    addTask(newTask);
    setAddingTask(false);
  };

  return (
    <div className='new-project-container'>
      <div className='new-project-form'>
        <div className='new-project-heading'>
          <h2>Adding Task</h2>
          <button onClick={() => setAddingTask(false)}>Cancel</button>
        </div>
        <div className='new-project-details'>
          <div className='new-project-info'>
            <label className='new-project-label'>
              Task
              <input
                className='new-project-name-input'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className='new-project-label'>
              Task Description
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
          <button onClick={handleCreateNewTask}>Add Task</button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectTask;
