import React, { useState, useEffect } from 'react';
import { Contact } from 'src/models/contact';
import { Project } from 'src/models/project';
import ProjectCard from '../../projects/ProjectCard';

interface ContactProjectsProps {
  contact: Contact;
}

const ContactProjects: React.FC<ContactProjectsProps> = ({ contact }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    const url = `http://localhost:3000/projects/contact?accountID=${contact.account_id}&contactID=${contact.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: Project[]) => {
        setProjects(data);
      });
  }, [contact.account_id, contact.id]);

  return (
    <div className='projects-view'>
      {projects.length === 0 ? (
        <div className='empty-projects-grid'>
          <p>Connected Projects will appear here</p>
        </div>
      ) : (
        <div className='projects-grid'>
          {projects.map((project) => (
            <div className='project-grid-item'>
              <ProjectCard project={project} key={project.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactProjects;
