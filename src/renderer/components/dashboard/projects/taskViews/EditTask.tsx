import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

import DeleteModal from '$renderer/components/DeleteModal';
import { Task } from 'src/models/task';
import useBackClick from '../../../../../hooks/useBackClick';
import {
  useRemoveTaskMutation,
  useUpdateTaskMutation,
} from '../../../../../services/taskAPI';

interface EditTaskProps {
  task: Task;
  setEditingTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditTask: React.FC<EditTaskProps> = ({ task, setEditingTask }) => {
  const goBack = useBackClick();
  const [name, setName] = useState(task.name);
  const [startDate, setStartDate] = useState<Date | null>();
  const [dueDate, setDueDate] = useState<Date | null>();
  const [showingDeleteAlert, setShowingDeleteAlert] = useState(false);

  const [removeTask] = useRemoveTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const toggleDeleteTask = () => {
    setShowingDeleteAlert(!showingDeleteAlert);
  };

  const handleDeleteTask = () => {
    goBack();
    removeTask(task.task_id);
    setShowingDeleteAlert(false);
  };

  const handleUpdateTask = async () => {
    if ( startDate !== null && startDate !== undefined) {
      const data: Task = {
        task_id: task.task_id,
        project_id: task.project_id,
        name: name,
        description: task.description,
        notes: task.notes,
        creation_date: task.creation_date,
        start_date: startDate,
        due_date: task.due_date,
        task_status: task.task_status,
        priority: task.priority,
        column_index: task.column_index,
        subtasks: task.subtasks,
      }
      updateTask(data)
    } else if (dueDate !== null && dueDate !== undefined ) {
      const data: Task = {
        task_id: task.task_id,
        project_id: task.project_id,
        name: name,
        description: task.description,
        notes: task.notes,
        creation_date: task.creation_date,
        start_date: task.start_date,
        due_date: dueDate,
        task_status: task.task_status,
        priority: task.priority,
        column_index: task.column_index,
        subtasks: task.subtasks,
      }
      updateTask(data)
    } else {
      const data: Task = {
        task_id: task.task_id,
        project_id: task.project_id,
        name: name,
        description: task.description,
        notes: task.notes,
        creation_date: task.creation_date,
        start_date: task.start_date,
        due_date: task.due_date,
        task_status: task.task_status,
        priority: task.priority,
        column_index: task.column_index,
        subtasks: task.subtasks,
      }
      updateTask(data)
    }
   
    setEditingTask(false);
  };

  useEffect(() => {
    const currentStartDate = new Date(task.start_date);
    const currentEndDate = new Date(task.due_date);
    setStartDate(currentStartDate);
    setDueDate(currentEndDate);
  }, [task.due_date, task.start_date]);

  return (
    <div className='edit-project-container'>
      <div className='edit-project-form'>
        <div className='edit-project-heading'>
          <h2>Edit Task</h2>
          <button onClick={() => setEditingTask(false)}>Cancel</button>
        </div>
        <div className='edit-project-details'>
          <div className='edit-project-info'>
            <label className='edit-project-label'>
              Edit Task Name
              <input
                className='edit-project-name-input'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className='edit-dates'>
              <div className='edit-project-date-picker'>
                <h3>Start Date</h3>
                <DatePicker
                  showIcon
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className='edit-project-date-input'
                  startDate={startDate}
                  endDate={dueDate}
                />
              </div>
              <div className='edit-project-date-picker'>
                <h3>End Date</h3>
                <DatePicker
                  showIcon
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  className='edit-project-date-input'
                  startDate={task.start_date}
                  endDate={dueDate}
                  minDate={task.start_date}
                />
              </div>
            </div>
            <div className='edit-buttons'>
              <button
                className='button-brand-lighter-blue'
                onClick={() => handleUpdateTask()}
              >
                Update
              </button>
              <button className='button-brand-pink' onClick={toggleDeleteTask}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {showingDeleteAlert && (
        <DeleteModal
          onDelete={handleDeleteTask}
          setShowingModal={setShowingDeleteAlert}
          item='task'
        />
      )}
    </div>
  );
};

export default EditTask;
