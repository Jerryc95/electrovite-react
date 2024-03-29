import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import { useAddProjectMutation } from '../../../../services/projectAPI';
import { projectStatus } from '../../../../statuses/projectStatus';

import 'react-datepicker/dist/react-datepicker.css';

interface NewProjectProps {
  setAddingProject: React.Dispatch<React.SetStateAction<boolean>>;
  id: number | undefined;
}

const NewProject: React.FC<NewProjectProps> = ({ setAddingProject, id }) => {
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

  const [addProject] = useAddProjectMutation();

  const handleCreateProject = async () => {
    const status = projectStatus.NotStarted;
    const newProject = {
      name: name,
      id: id,
      description: description,
      startDate: startDate,
      endDate: endDate,
      status: status,
      completed: false,
    };
    addProject(newProject);
    setAddingProject(false);
  };

  return (
    <div className='new-project-container'>
      <div className='new-project-form'>
        <div className='new-project-heading'>
          <h2>Creating new project</h2>
          <button onClick={() => setAddingProject(false)}>
            Cancel
          </button>
        </div>
        <div className='new-project-details'>
          <div className='new-project-info'>
            <label className='new-project-label'>
              Project Name
              <input
                className='new-project-name-input'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className='new-project-label'>
              Project Description
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
          <button onClick={handleCreateProject}>Create Project</button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
