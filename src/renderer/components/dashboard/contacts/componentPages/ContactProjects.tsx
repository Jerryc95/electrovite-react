import React, { useState } from 'react';

import { Contact } from 'src/models/contact';
import ProjectCard from '../../projects/ProjectCard';
import useToggleProject from '../../../../../hooks/useToggleProject';
import Spinner from '$renderer/components/Spinner';
import ConnectDataModal from '$renderer/components/ConnectDataModal';
import useConnectProject from '../../../../../hooks/useConnectProject';

interface ContactProjectsProps {
  contact: Contact;
}

const ContactProjects: React.FC<ContactProjectsProps> = ({ contact }) => {
  const [showingConnectProject, setShowingConnectProject] = useState(false);

  const toggleProject = useToggleProject();

  const {
    projects,
    isLoading,
    BKProjects,
    setSelectedProject,
    getProjects,
    handleConnectProject,
  } = useConnectProject(contact);

  return (
    <div>
      <div className='contact-component-page-heading'>
        <h3>Projects</h3>
        <button
          className='button-brand-dark-purple'
          onClick={() => {
            setShowingConnectProject(true);
          }}
        >
          Connect
        </button>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='projects-view'>
          {projects.length === 0 ? (
            <div className='empty-projects-grid'>
              <p>Connected Projects will appear here</p>
            </div>
          ) : (
            <div className='projects-grid'>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className='project-grid-item'
                  onClick={() => toggleProject(project, project.id)}
                >
                  <ProjectCard project={project} key={project.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {showingConnectProject && (
        <ConnectDataModal
          onSubmit={handleConnectProject}
          onLoad={getProjects}
          setShowingModal={setShowingConnectProject}
          currentItem='project'
          connectingItem='contact'
          data={BKProjects}
          setData={setSelectedProject}
          height='225px'
          width='450px'
        />
      )}
    </div>
  );
};

export default ContactProjects;
