import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

import DeleteModal from '$renderer/components/DeleteModal';
import { Task } from 'src/models/task';

interface EditTaskProps {
  task: Task;
  setEditingTask: React.Dispatch<React.SetStateAction<boolean>>;
  setShowingTask: React.Dispatch<React.SetStateAction<boolean>>;
  setTaskName: React.Dispatch<React.SetStateAction<string>>;
}

const EditTask: React.FC<EditTaskProps> = ({
  task,
  setEditingTask,
  setShowingTask,
  setTaskName,
}) => {
  const [name, setName] = useState(task.name);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [showingDeleteAlert, setShowingDeleteAlert] = useState(false);

  const toggleDeleteTask = () => {
    setShowingDeleteAlert(!showingDeleteAlert);
  };

  const handleDeleteTask = () => {
    // const url = `http://localhost:3000/tasks/delete/${task.task_id}`;
    // try {
    //   fetch(url, {
    //     method: 'DELETE',
    //   });
    //   setTasks(
    //     tasks.filter((t) => t.task_id != task.task_id),
    //   );
    //   setShowingTask(false);
    // } catch (error) {
    //   console.log(error);
    // }
    // setShowingDeleteAlert(false);
  };

  const handleUpdateTask = async () => {
    const url = `http://localhost:3000/tasks/update/${task.task_id}`;
    const data = {
      name: name,
      startDate: startDate,
      endDate: endDate,
    };
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.log(error);
    }
    // const updatedTasks = tasks.map((t, i) => {
    //   if (i === task.task_id) {
    //     return task;
    //   } else {
    //     return t;
    //   }
    // });
    setTaskName(name)
    // setTasks(updatedTasks);
    setEditingTask(false);
  };

  useEffect(() => {
    const currentStartDate = new Date(task.start_date);
    const currentEndDate = new Date(task.due_date);
    setStartDate(currentStartDate);
    setEndDate(currentEndDate);
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
                  startDate={task.start_date}
                  endDate={endDate}
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
              <button
                className='button-brand-pink'
                onClick={toggleDeleteTask}
              >
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
