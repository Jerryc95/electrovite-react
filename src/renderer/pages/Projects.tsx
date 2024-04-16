import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/dashboard/projects/ProjectCard';
import NewProject from '$renderer/components/dashboard/projects/NewProject';
// import ProjectDetail from '$renderer/components/dashboard/projects/ProjectDetail';
import { Project } from '../../models/project';
import { selectedProjects, selectProject } from '../../services/projectSlice';
import { useFetchProjectsQuery } from '../../services/projectAPI';
import { useFetchUpcomingTasksQuery } from '../../services/taskAPI';
import { RecurringTask } from 'src/models/recurringTask';
import '../styles/projects.scss';
import NewRecurringTask from '$renderer/components/dashboard/projects/recurringTasks/NewRecurringTask';
import RecurringTaskView from '$renderer/components/dashboard/projects/recurringTasks/RecurringTask';
import RecurringTaskTracker from '$renderer/components/dashboard/projects/recurringTasks/RecurringTaskTracker';
import { selectedAccount } from '../../services/accountSlice';
// import UpcomingTaskView from '$renderer/components/dashboard/home/UpcomingTaskView';

const Projects: React.FC = () => {
  const user = useSelector(selectedAccount);
  const projects = useSelector(selectedProjects);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [addingProject, setAddingProject] = useState(false);
  const [addingRecurringTask, setAddingRecurringTask] = useState(false);
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
  // const [showingProject, setShowingProject] = useState(false);
  // const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  useFetchProjectsQuery(user.account?.id);
  useFetchUpcomingTasksQuery(user.account?.id);
  

  const toggleProject = (project: Project) => {
    dispatch(selectProject(project));
    navigate(`/projects/${project.name.replaceAll(" ", "-")}`);
    // setSelectedProject(project);
    // setShowingProject(!showingProject);
  };

  // const timeDifference = (date: Date) => {
  //   const today = new Date();
  //   return Math.ceil(
  //     (today.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
  //   );
  // };

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

  // const setUpcomingTasks = () => {

  // fetch for tasks here need to make new api get request for it
  // const daysRemaining = Math.ceil(
  //   timeDifference(upcomingTask.due_date) / (1000 * 60 * 60 * 24),
  // );
  // };

  // useEffect(() => {
  //   console.log(upcomingTasks);
  // }, []);

  return (
    <div className='projects-container'>
      <div className='projects-header'>
        <h2>Projects</h2>
        <button onClick={() => setAddingProject(true)}>Add New Project</button>
      </div>
      <h3>Upcoming Tasks</h3>
      <div className='projects-overview'>
        {/* {upcomingTasks.length === 0 ? (
          <p>
            Upcoming tasks across projects will appear here once tasks are
            added.
          </p>
        ) : (
          <div>
            {
              upcomingTasks.map((upcomingTask) => (
                // <UpcomingTaskView upcomingTask={upcomingTask}/>
                <p>1</p>
              ))
            }
          </div>
        )} */}
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
          <button onClick={()=> setAddingRecurringTask(true)}>
            Add Task
          </button>
          {recurringTasks.length === 0 ? (
            <p className='info-text'>
              Add recurring tasks that are part of your normal workflow.
            </p>
          ) : (
            <div className='task-list'>
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

      {/* {showingProject && (
        <ProjectDetail
          project={selectedProject}
          setShowingProject={setShowingProject}
        />
      )} */}
      {addingRecurringTask && (
        <NewRecurringTask
          setAddingTask={setAddingRecurringTask}
          id={user.account?.id}
          // setRecurringTasks={setRecurringTasks}
        />
      )}
    </div>
  );
};

export default Projects;
