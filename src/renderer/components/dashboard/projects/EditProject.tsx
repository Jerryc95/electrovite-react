import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

import {
  useUpdateProjectMutation,
  useRemoveProjectMutation,
} from '../../../../services/projectAPI';
import DeleteModal from '$renderer/components/DeleteModal';
import { Project } from 'src/models/project';
import useBackClick from '../../../../hooks/useBackClick';

interface EditProjectProps {
  project: Project;
  setEditingProject: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProject: React.FC<EditProjectProps> = ({
  project,
  setEditingProject,
}) => {
  const goBack = useBackClick();
  const [name, setName] = useState(project.name);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [showingDeleteAlert, setShowingDeleteAlert] = useState(false);

  const [removeProject] = useRemoveProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const toggleDeleteProject = () => {
    setShowingDeleteAlert(!showingDeleteAlert);
  };

  const handleDeleteProject = () => {
    goBack();
    removeProject(project.id);
    setShowingDeleteAlert(false);
  };

  const handleUpdateProject = () => {
    console.log(startDate);
    console.log(endDate);
    if (
      startDate !== null &&
      startDate !== undefined &&
      endDate !== null &&
      endDate !== undefined
    ) {
      const data: Project = {
        id: project.id,
        account_id: project.account_id,
        name: name,
        description: project.description,
        notes: project.notes,
        creation_date: project.creation_date,
        start_date: startDate,
        end_date: endDate,
        status: project.status,
        completed: project.completed,
        contact_id: project.contact_id,
      };
      updateProject(data);
    }
    setEditingProject(false);
  };

  useEffect(() => {
    const currentStartDate = new Date(project.start_date);
    const currentEndDate = new Date(project.end_date);
    setStartDate(currentStartDate);
    setEndDate(currentEndDate);
  }, [project.end_date, project.start_date]);

  return (
    <div className='edit-project-container'>
      <div className='edit-project-form'>
        <div className='edit-project-heading'>
          <h2>Edit Project</h2>
          <button onClick={() => setEditingProject(false)}>Cancel</button>
        </div>
        <div className='edit-project-details'>
          <div className='edit-project-info'>
            <label className='edit-project-label'>
              Edit Project Name
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
                  startDate={project.start_date}
                  endDate={endDate}
                  minDate={project.start_date}
                />
              </div>
            </div>
            <div className='edit-buttons'>
              <button
                className='button-brand-lighter-blue'
                onClick={handleUpdateProject}
              >
                Update
              </button>
              <button
                className='button-brand-pink'
                onClick={toggleDeleteProject}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {showingDeleteAlert && (
        <DeleteModal
          onDelete={handleDeleteProject}
          setShowingModal={setShowingDeleteAlert}
          item='project'
        />
      )}
    </div>
  );
};

export default EditProject;
