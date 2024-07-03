import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import ProjectCard from '../components/dashboard/projects/ProjectCard';
import NewProject from '$renderer/components/dashboard/projects/NewProject';
import { getProjects } from '../../services/projectSlice';
import { useFetchProjectsQuery } from '../../services/projectAPI';
import '../styles/projects.scss';
import NewRecurringTask from '$renderer/components/dashboard/projects/recurringTasks/NewRecurringTask';
import RecurringTaskView from '$renderer/components/dashboard/projects/recurringTasks/RecurringTask';
import RecurringTaskTracker from '$renderer/components/dashboard/projects/recurringTasks/RecurringTaskTracker';
import { getUser } from '../../services/accountSlice';
import { getRecurringTasks } from '../../services/recurringTaskSlice';
import { useFetchRecurringTasksQuery } from '../../services/recurringTaskAPI';
import { getUpcomingTasks } from '../../services/homeSlice';
import UpcomingTaskView from '$renderer/components/dashboard/home/UpcomingTaskView';
import { getSubscription } from '../../services/subscriptionSlice';
import Paywall from '$renderer/components/Paywall';
import useClosePaywall from '../../hooks/useClosePaywall';
import useToggleProject from '../../hooks/useToggleProject';
import { parseDate } from '../../helpers/ParseDate';

const Projects: React.FC = () => {
  const user = useSelector(getUser);
  const subscription = useSelector(getSubscription);
  const projects = useSelector(getProjects);
  const recurringTasks = useSelector(getRecurringTasks);
  const upcomingTasks = useSelector(getUpcomingTasks);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [addingProject, setAddingProject] = useState(false);
  const [viewingPaywall, setViewingPaywall] = useState(false);
  const [addingRecurringTask, setAddingRecurringTask] = useState(false);
  const [viewingRecurringTasks, setViewingRecurringTasks] = useState(true);
  const [selectedSort, setSelectedSort] = useState('Created');

  const toggleProject = useToggleProject();
  const closePaywall = useClosePaywall(() => setViewingPaywall(false));

  const sortOptions = [
    'Created',
    'Name',
    'Start Date',
    'Ascending End Date',
    'Descending End Date',
    'Status',
  ];

  const projectFilters = [
    { name: 'All', cName: 'filter-capsule all' },
    { name: 'Not Started', cName: 'filter-capsule not-started' },
    { name: 'In Progress', cName: 'filter-capsule in-progress' },
    { name: 'Live', cName: 'filter-capsule live' },
    { name: 'Completed', cName: 'filter-capsule completed' },
  ];

  useFetchProjectsQuery(user.account?.id, {
    refetchOnMountOrArgChange: true,
  });
  useFetchRecurringTasksQuery(user.account?.id);

  const toggleRecurringTasks = () => {
    setViewingRecurringTasks(!viewingRecurringTasks);
  };

  const handleAddProject = () => {
    if (projects.length >= 3 && subscription?.tier == 1) {
      setViewingPaywall(true);
    } else {
      setAddingProject(true);
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    switch (selectedSort) {
      case 'Created': {
        return (
          parseDate(a.creation_date).getTime() -
          parseDate(b.creation_date).getTime()
        );
      }
      case 'Name': {
        return a.name.localeCompare(b.name);
      }
      case 'Start Date': {
        return (
          parseDate(a.start_date).getTime() - parseDate(b.start_date).getTime()
        );
      }
      case 'Ascending End Date': {
        return (
          parseDate(a.end_date).getTime() - parseDate(b.end_date).getTime()
        );
      }
      case 'Descending End Date': {
        return (
          parseDate(b.end_date).getTime() - parseDate(a.end_date).getTime()
        );
      }
      case 'Status': {
        return a.status.localeCompare(b.status);
      }
    }
    return 0;
  });

  const filteredProjects = sortedProjects.filter((project) => {
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
        <button onClick={handleAddProject}>Add New Project</button>
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
            {upcomingTasks.map((upcomingTask) => (
              <div
                key={upcomingTask.task_id}
                className='upcoming-task-container'
              
              >
                <UpcomingTaskView upcomingTask={upcomingTask} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='projects-bottom-container'>
        <div className='projects-view'>
          <div className='project-filter-row'>
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
            <div>
              <select
                className='sort-options'
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                {sortOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
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
                  onClick={() => toggleProject(project, project.id)}
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
                  {recurringTasks.some((task) => task.frequency == 'Daily') && (
                    <RecurringTaskTracker
                      label='Daily Tasks'
                      recurringTasks={recurringTasks}
                    />
                  )}
                  {recurringTasks.some(
                    (task) => task.frequency == 'Weekly',
                  ) && (
                    <RecurringTaskTracker
                      label='Weekly Tasks'
                      recurringTasks={recurringTasks}
                    />
                  )}
                  {recurringTasks.some(
                    (task) => task.frequency == 'Monthly',
                  ) && (
                    <RecurringTaskTracker
                      label='Monthly Tasks'
                      recurringTasks={recurringTasks}
                    />
                  )}
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

      {viewingPaywall && (
        <Paywall
          subscription={subscription!}
          requiredTier={2}
          requestedFeature='Unlimited Projects'
          onClose={closePaywall}
        />
      )}
    </div>
  );
};

export default Projects;
