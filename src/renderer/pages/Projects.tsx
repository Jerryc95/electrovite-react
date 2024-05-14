import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import ProjectCard from '../components/dashboard/projects/ProjectCard';
import NewProject from '$renderer/components/dashboard/projects/NewProject';
import { Project } from '../../models/project';
import { getProjects, selectProject } from '../../services/projectSlice';
import { useFetchProjectsQuery } from '../../services/projectAPI';
import '../styles/projects.scss';
import NewRecurringTask from '$renderer/components/dashboard/projects/recurringTasks/NewRecurringTask';
import RecurringTaskView from '$renderer/components/dashboard/projects/recurringTasks/RecurringTask';
import RecurringTaskTracker from '$renderer/components/dashboard/projects/recurringTasks/RecurringTaskTracker';
import { getUser } from '../../services/accountSlice';
import { selectedRecurringTasks } from '../../services/recurringTaskSlice';
import { useFetchRecurringTasksQuery } from '../../services/recurringTaskAPI';
import { selectedUpcomingTasks } from '../../services/homeSlice';
import UpcomingTaskView from '$renderer/components/dashboard/home/UpcomingTaskView';

const Projects: React.FC = () => {
  const user = useSelector(getUser);
  const projects = useSelector(getProjects);
  const recurringTasks = useSelector(selectedRecurringTasks);
  const upcomingTasks = useSelector(selectedUpcomingTasks)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [addingProject, setAddingProject] = useState(false);
  const [addingRecurringTask, setAddingRecurringTask] = useState(false);
  const [viewingRecurringTasks, setViewingRecurringTasks] = useState(true);

  useFetchProjectsQuery(user.account?.id);
  useFetchRecurringTasksQuery(user.account?.id);

  const toggleProject = (project: Project) => {
    dispatch(selectProject(project));
    navigate(`/projects/${project.name.replaceAll(' ', '-')}`);
  };

  const toggleRecurringTasks = () => {
    setViewingRecurringTasks(!viewingRecurringTasks);
  };

  const projectFilters = [
    { name: 'All', cName: 'filter-capsule all' },
    { name: 'Not Started', cName: 'filter-capsule not-started' },
    { name: 'In Progress', cName: 'filter-capsule in-progress' },
    { name: 'Live', cName: 'filter-capsule live' },
    { name: 'Completed', cName: 'filter-capsule completed' },
  ];

  const filteredProjects = projects.filter((project) => {
    switch (selectedFilter) {
      case 'All': {
        return project;
      }
      case 'Not Started': {
        if (project.status === 'Not Started') {
          return project;
        }
        break;
      }
      case 'In Progress': {
        if (project.status === 'In Progress') {
          return project;
        }
        break;
      }
      case 'Live': {
        if (project.status === 'Live') {
          return project;
        }
        break;
      }
      case 'Completed': {
        if (project.status === 'Completed') {
          return project;
        }
        break;
      }
    }
  });

  return (
    <div className='projects-container'>
      <div className='projects-header'>
        <h2>Projects</h2>
        <button onClick={() => setAddingProject(true)}>Add New Project</button>
      </div>
      <h3>Upcoming Tasks</h3>
      <div className='projects-overview'>
        {upcomingTasks.length === 0 ? (
          <p>
            Upcoming tasks across projects will appear here once tasks are
            added.
          </p>
        ) : (
          <div className='upcoming-task-row'>
            {
              upcomingTasks.map((upcomingTask) => (
                <div key={upcomingTask.task_id} className='upcoming-task-container'>
                   <UpcomingTaskView upcomingTask={upcomingTask}/>
                  </div>
               
              ))
            }
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
          <div>
            <button
              className='button-brand-magenta'
              onClick={() => setAddingRecurringTask(true)}
            >
              Add Task
            </button>
              <FontAwesomeIcon
                onClick={toggleRecurringTasks}
                icon={viewingRecurringTasks ? faChevronDown : faChevronUp}
                size='lg'
                className={`task-chevron ${
                  viewingRecurringTasks ? 'collapsed-chevron' : ''
                }`}
              />
        
          </div>

          {recurringTasks.length === 0 ? (
            <p className='info-text'>
              Add recurring tasks that are part of your normal workflow.
            </p>
          ) : (
            <div className='task-list'>
              {viewingRecurringTasks && (
                <div>
                  <RecurringTaskTracker
                    label='Daily Tasks'
                    recurringTasks={recurringTasks}
                  />
                  <RecurringTaskTracker
                    label='Weekly Tasks'
                    recurringTasks={recurringTasks}
                  />
                  <RecurringTaskTracker
                    label='Monthly Tasks'
                    recurringTasks={recurringTasks}
                  />
                </div>
              )}

              {recurringTasks.map((task) => (
                <RecurringTaskView key={task.rt_id} recurringTask={task} />
              ))}
            </div>
          )}
        </div>
      </div>
      {addingProject && (
        <NewProject setAddingProject={setAddingProject} id={user.account?.id} />
      )}

      {addingRecurringTask && (
        <NewRecurringTask
          setAddingTask={setAddingRecurringTask}
          id={user.account?.id}
        />
      )}
    </div>
  );
};

export default Projects;
