import React, { useState, ChangeEvent, useEffect } from 'react';

import ProgressBar from '$renderer/components/ProgressBar';
import { Task } from 'src/models/task';
import { taskStatus } from '../../../../../statuses/taskStatus';

interface TaskListItemProps {
  task: Task;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task>>;
  setShowingTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  setSelectedTask,
  setShowingTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(task.task_status);
  const [uncompletedSubTasks, setUncompletedSubTasks] = useState(0);
  const [completedSubTask, setCompletedSubTasks] = useState(0);
  const [totalSubTasks, setTotalSubTasks] = useState(
    uncompletedSubTasks + completedSubTask,
  );

  const dateParser = (date: Date) => {
    return new Date(date);
  };

  const handleSetTask = (task: Task) => {
    setSelectedTask(task);
    setShowingTask(true);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setStatus(task.task_status);
  };

  const preventTaskOpening = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleSaveClick = async () => {
    task.task_status = status;
    setIsEditing(false);
    const data = {
      status: task.task_status,
    };
    const url = `http://localhost:3000/tasks/update/${task.task_id}`;
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

  useEffect(() => {
    if (task.subTasks) {
      let uncompleted = 0;
      let completed = 0;
      setTotalSubTasks(task.subTasks.length);
      task.subTasks.forEach((subtask) => {
        if (subtask.subtask_status === taskStatus.Completed) {
          completed += 1;
        } else {
          uncompleted += 1;
        }
      });
      setUncompletedSubTasks(uncompleted);
      setCompletedSubTasks(completed);
    }
  }, []);

  return (
    <div
      className='task-list-item-container'
      onClick={() => handleSetTask(task)}
    >
      <p className='task-name'>{task.name}</p>
      <div className='task-progress'>
        {/* <ProgressBar height={15} current={completedSubTask} total={totalSubTasks} /> */}
        {uncompletedSubTasks !== 0 ? (
          <ProgressBar
            current={completedSubTask}
            total={totalSubTasks}
            height={15}
          />
        ) : (
          <span className='no-tasks'>No subtasks added</span>
        )}
      </div>
      <p className={`task-priority ${task.priority}`}>{task.priority}</p>
      <p className='task-status' onClick={preventTaskOpening}>
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
      <p className='task-due-date'>
        {dateParser(task.due_date).toLocaleDateString()}
      </p>
    </div>
  );
};

export default TaskListItem;
