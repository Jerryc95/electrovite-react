import React, { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { selectTask } from '../../../../../services/taskSlice';
import ProgressBar from '$renderer/components/ProgressBar';
import { Task } from 'src/models/task';
import { taskStatus } from '../../../../../statuses/taskStatus';
import { useUpdateTaskMutation } from '../../../../../services/taskAPI';

interface TaskListItemProps {
  task: Task;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectName } = useParams();
  const [updateTask] = useUpdateTaskMutation();

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

  const toggleTask = (task: Task) => {
    dispatch(selectTask(task));
    navigate(
      `/projects/${projectName?.replaceAll(' ', '-')}/${task.name.replaceAll(
        ' ',
        '-',
      )}`,
    );
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setStatus(task.task_status);
  };

  const preventTaskOpening = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleSaveClick = async () => {
    const updatedTask: Task = {
      task_id: task.task_id,
      project_id: task.project_id,
      name: task.name,
      description: task.description,
      notes: task.notes,
      creation_date: task.creation_date,
      start_date: task.start_date,
      due_date: task.due_date,
      task_status: status,
      priority: task.priority,
      column_index: task.column_index,
      subtasks: task.subtasks,
    };

    updateTask(updatedTask);
    setIsEditing(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  useEffect(() => {
    if (task.subtasks) {
      let uncompleted = 0;
      let completed = 0;
      setTotalSubTasks(task.subtasks.length);
      task.subtasks.forEach((subtask) => {
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
    <div className='task-list-item-container' onClick={() => toggleTask(task)}>
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
      <div className='task-status' onClick={preventTaskOpening}>
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
      </div>
      <p className='task-due-date'>
        {dateParser(task.due_date).toLocaleDateString()}
      </p>
    </div>
  );
};

export default TaskListItem;
