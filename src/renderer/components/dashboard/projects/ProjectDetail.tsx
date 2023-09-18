import React, { PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faGear } from '@fortawesome/free-solid-svg-icons';

import { Project } from '../../../../models/project';

interface ProjectDetailProps {
  project: Project;
  setShowingProject: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectDetail: React.FC<PropsWithChildren<ProjectDetailProps>> = ({
  project,
  setShowingProject,
}) => {
  const toggleProject = () => {
    setShowingProject(false);
  };

  return (
    <div className='project-detail-container'>
      <div className='project-detail-header'>
        <div className='project-detail-header-leading'>
          <div className='project-detail-back' onClick={toggleProject}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <p>Projects</p>
          </div>
          <h2>{project.name}</h2>
        </div>
        <div className='project-detail-header-trailing'>
          {/* create overlay component similiar to add task for both of these */}
          <FontAwesomeIcon icon={faGear} className='' />
          <button>Add task</button>
        </div>
      </div>
      <div className='project-detail-top-container'>
        <h3>Road Map</h3>
        <div className='project-detail-roadmap'></div>
      </div>
      <div className='project-detail-bottom-container'>
        <div className='project-detail-board'>
          <p>Board here</p>
        </div>
        <div className='project-detail-task-list'>
          <p>task list here</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
