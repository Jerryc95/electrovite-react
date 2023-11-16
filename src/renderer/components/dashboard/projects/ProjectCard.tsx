import React from 'react';
import { Project } from 'src/models/project';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const dateParser = (date: Date) => {
    return new Date(date);
  };
  let statusClass = '';

  switch (project.status) {
    case 'Not Started':
      statusClass = 'not-started-border';
      break;
    case 'In Progress':
      statusClass = 'in-progress-border';
      break;
    case 'Live':
      statusClass = 'live-border';
      break;
    case 'Completed':
      statusClass = 'completed-border';
      break;
    default:
      statusClass = '';
  }

  return (
    <div className={`project-card-container ${statusClass}`}>
      <div className='project-card-top section'>
        <h3>{project.name}</h3>
        <p className='project-card-description'>{project.description}</p>
      </div>
      <div className='project-card-bottom-section'>
        <p>End Date: {dateParser(project.end_date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
