import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Contact } from 'src/models/contact';
import { Project } from 'src/models/project';
import ProjectCard from '../../projects/ProjectCard';
import { selectProject } from '../../../../../services/projectSlice';

interface ContactProjectsProps {
  contact: Contact;
}

const ContactProjects: React.FC<ContactProjectsProps> = ({ contact }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleProject = (project: Project) => {
    dispatch(selectProject(project));
    navigate(`/projects/${project.name.replaceAll(' ', '-')}`);
  };

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
            <div
              className='project-grid-item'
              onClick={() => toggleProject(project)}
            >
              <ProjectCard project={project} key={project.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactProjects;
