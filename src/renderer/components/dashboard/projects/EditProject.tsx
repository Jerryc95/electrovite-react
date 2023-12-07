import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

import DeleteModal from '$renderer/components/DeleteModal';
import { Project } from 'src/models/project';

interface EditProjectProps {
  project: Project;
  setEditingProject: React.Dispatch<React.SetStateAction<boolean>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  projects: Project[];
  setShowingProject: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
}

const EditProject: React.FC<EditProjectProps> = ({
  project,
  setEditingProject,
  setProjects,
  projects,
  setShowingProject,
  setProjectName,
}) => {
  const [name, setName] = useState(project.name);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [showingDeleteAlert, setShowingDeleteAlert] = useState(false);

  const toggleDeleteProject = () => {
    setShowingDeleteAlert(!showingDeleteAlert);
  };

  const handleDeleteProject = () => {
    const url = `http://localhost:3000/projects/delete/${project.id}`;
    try {
      fetch(url, {
        method: 'DELETE',
      });
      setProjects(
        projects.filter((p) => p.id != project.id),
      );
      setShowingProject(false);
    } catch (error) {
      console.log(error);
    }
    setShowingDeleteAlert(false);
  };

  const handleUpdateProject = async () => {
    const url = `http://localhost:3000/projects/update/${project.id}`;
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
    const updatedProjects = projects.map((p, i) => {
      if (i === project.id) {
        return project;
      } else {
        return p;
      }
    });
    setProjectName(name)
    setProjects(updatedProjects);
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
