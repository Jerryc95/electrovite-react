import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ProjectCard from '../components/dashboard/projects/ProjectCard';
import NewProject from '$renderer/components/dashboard/projects/NewProject';
import ProjectDetail from '$renderer/components/dashboard/projects/ProjectDetail';
import { Project } from '../../models/project';
import { RootState } from '../../services/store';
import { RecurringTask } from 'src/models/recurringTask';
import '../styles/projects.scss';
import '../styles/detailPage.scss';
import NewRecurringTask from '$renderer/components/dashboard/projects/recurringTasks/NewRecurringTask';
import RecurringTaskView from '$renderer/components/dashboard/projects/recurringTasks/RecurringTask';
import RecurringTaskTracker from '$renderer/components/dashboard/projects/recurringTasks/RecurringTaskTracker';

interface IProjectData {
  projects: Project[];
  recurringTasks: RecurringTask[];
}

const Projects: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [addingProject, setAddingProject] = useState(false);
  const [addingRecurringTask, setAddingRecurringTask] = useState(false);
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
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

  const filteredProjects = projects.filter((project) => {
    switch(selectedFilter) {
      case "All": {
        return project;
      }
      case "Not Started": {
        if(project.status === "Not Started") {
          return project;
        }
        break;
      }
      case "In Progress": {
        if(project.status === "In Progress") {
          return project;
        }
        break;
      }
      case "Live": {
        if(project.status === "Live") {
          return project;
        }
        break;
      }
      case "Completed": {
        if(project.status === "Completed") {
          return project;
        }
        break;
      }
    }
  });

  useEffect(() => {
    if (accountState) {
      const url = `http://localhost:3000/projects?id=${accountState.account?.id}`;
      fetch(url)
        .then((response) => response.json())
        .then(async (data: IProjectData) => {
          await Promise.all([
            setProjects(
              data.projects.sort((a, b) => {
                if (a.id < b.id) {
                  return -1;
                }
                return 0;
              }),
            ),
            setRecurringTasks(
              data.recurringTasks.sort((a, b) => {
                if (a.rt_id < b.rt_id) {
                  return -1;
                }
                return 0;
              }),
            ),
          ]);
        });
    }
  }, [recurringTasks]);

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
        {projects.length === 0 || recurringTasks.length === 0 ? (
          <p>
            Details across projects will appear here once projects are added
          </p>
        ) : (
          <div>
            <RecurringTaskTracker
              label='Daily Tasks Complete'
              recurringTasks={recurringTasks}
            />
          </div>
        )}
      </div>
      <div className='projects-bottom-container'>
        <div className='projects-view'>
          <div className='projects-filters'>
            {projectFilters.map((filter) => (
              <div
                key={filter.name}
                onClick={() => setSelectedFilter(filter.name)}
                className={` ${filter.cName} ${
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
              {filteredProjects.map((project) => (
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
          <h3>Recurring Tasks</h3>
          {recurringTasks.length === 0 ? (
            <p className='info-text'>
              Add recurring tasks that are part of your normal workflow.
            </p>
          ) : (
            <div className='task-list'>
              {recurringTasks.map((task) => (
                <RecurringTaskView key={task.rt_id} recurringTask={task} />
              ))}
            </div>
          )}

          <button onClick={() => setAddingRecurringTask(true)}>Add Task</button>
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
          accountID={accountState.account?.id}
          setProjects={setProjects}
          projects={projects}
        />
      )}
      {addingRecurringTask && (
        <NewRecurringTask
          setAddingTask={setAddingRecurringTask}
          accountID={accountState.account?.id}
          setRecurringTasks={setRecurringTasks}
        />
      )}
      {}
    </div>
  );
};

export default Projects;
