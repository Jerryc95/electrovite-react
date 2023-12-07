import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

import DeleteModal from '$renderer/components/DeleteModal';
import { Subtask } from 'src/models/subTask';


interface EditSubtaskProps {
  subtask: Subtask;
  setEditingSubtask: React.Dispatch<React.SetStateAction<boolean>>;
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  subtasks: Subtask[];
  setSubtaskName: React.Dispatch<React.SetStateAction<string>>;
}

const EditSubtask: React.FC<EditSubtaskProps> = ({
  subtask,
  setEditingSubtask,
  setSubtasks,
  subtasks,
  setSubtaskName,
}) => {
  const [name, setName] = useState(subtask.name);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [showingDeleteAlert, setShowingDeleteAlert] = useState(false);

  const toggleDeleteSubtask = () => {
    setShowingDeleteAlert(!showingDeleteAlert);
  };

  const handleDeleteSubtask = () => {
    const url = `http://localhost:3000/tasks/delete/${subtask.subtask_id}`;
    try {
      fetch(url, {
        method: 'DELETE',
      });
      setSubtasks(
        subtasks.filter((st) => st.subtask_id != subtask.subtask_id),
      );
    } catch (error) {
      console.log(error);
    }
    setShowingDeleteAlert(false);
  };

  const handleUpdateTask = async (id: number) => {
    const url = `http://localhost:3000/tasks/update/${subtask.subtask_id}`;
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
    const updatedTasks = subtasks.map((st) => {
      if (id === subtask.subtask_id) {
        return subtask;
      } else {
        return st;
      }
    });
    setSubtaskName(name)
    setSubtasks(updatedTasks);
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
          <h2>Edit Task</h2>
          <button onClick={() => setEditingSubtask(false)}>Cancel</button>
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
                  startDate={subtask.start_date}
                  endDate={endDate}
                  minDate={subtask.start_date}
                />
              </div>
            </div>
            <div className='edit-buttons'>
              <button
                className='button-brand-lighter-blue'
                onClick={() => handleUpdateTask(subtask.subtask_id)}
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
