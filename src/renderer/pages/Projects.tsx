import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ProjectCard from '../components/dashboard/projects/ProjectCard';
import NewProject from '$renderer/components/dashboard/projects/NewProject';
import ProjectDetail from '$renderer/components/dashboard/projects/ProjectDetail';
import { Project } from '../../models/project';
import { RootState } from '../../services/store';
import '../styles/projects.scss';
import '../styles/detailPage.scss';

const Projects: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [addingProject, setAddingProject] = useState(false);
  const [showingProject, setShowingProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const accountState = useSelector((state: RootState) => state.accountReducer);

  const toggleProject = (project: Project) => {
    setSelectedProject(project);
    setShowingProject(!showingProject);
  };

  const projectFilters = [
    { name: 'All', cName: 'filter-capsule all' },
    { name: 'Not Started', cName: 'filter-capsule not-started' },
    { name: 'In Progress', cName: 'filter-capsule in-progress' },
    { name: 'Live', cName: 'filter-capsule live' },
    { name: 'Completed', cName: 'filter-capsule completed' },
  ];

  useEffect(() => {
    if (accountState) {
      const url = `http://localhost:3000/projects?id=${accountState.account?.id}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setProjects(data);
        });
    }
  }, []);

  return (
    <div className='projects-container'>
      <div className='projects-header'>
        <h2>Projects</h2>
        <button onClick={() => setAddingProject(!addingProject)}>
          Add New Project
        </button>
      </div>
      <h3>Overview</h3>
      <div className='projects-overview'>
        <p>Details across projects will appear here once projects are added</p>
      </div>
      <div className='projects-bottom-container'>
        <div className='projects-view'>
          <div className='projects-filters'>
            {projectFilters.map((filter) => (
              <div
                key={filter.name}
                onClick={() => setSelectedFilter(filter.name)}
                className={`filter-capsule ${filter.cName} ${
                  selectedFilter === filter.name ? 'selected' : ''
                }`}
              >
                {filter.name}
              </div>
            ))}
          </div>

          {projects.length === 0 ? (
            <div className='empty-projects-grid'>
              <p>Projects will appear here once created.</p>
            </div>
          ) : (
            <div className='projects-grid'>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className='project-grid-item '
                  onClick={() => toggleProject(project)}
                >
                  <ProjectCard project={project} key={project.id} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='projects-task-view'>
          <h3>Tasks</h3>
          <div className='task-list'></div>
          <p>
            Add daily or weekly repetitive tasks that are part of your everyday
            workflow.
          </p>
          <button>Add Task</button>
        </div>
      </div>
      {addingProject && (
        <NewProject
          setAddingProject={setAddingProject}
          addingProject={addingProject}
          setProjects={setProjects}
          id={accountState.account?.id}
        />
      )}

      {showingProject && (
        <ProjectDetail
          project={selectedProject}
          setShowingProject={setShowingProject}
        />
      )}
    </div>
  );
};

export default Projects;
